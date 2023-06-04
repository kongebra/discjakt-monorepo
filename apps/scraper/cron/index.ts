import { Currency, Product } from 'database';
import * as cron from 'node-cron';
import { Crawler, CrawlerBaseType } from '../crawler';
import prisma from '../lib/prisma';
import { calculateDaysSince } from '../utils/date';
import logger from '../utils/logger';
import { priceToAvailability } from '../utils/price';
import { getCrawlerConfigs } from './crawler';
import { configureParseFields } from './helpers';
import { midnightPriceChecker } from './midnight-price-checker';

export function initCronJobs() {
  // every minute
  // logger.info('Starting cron job for product cleanup, running');
  // cron.schedule('*/1 * * * *', productCleanup);

  // every midnight
  cron.schedule('0 0 * * *', async () => {
    await midnightPriceChecker();
  });

  type CrawlerType = Product & { price: number; currency: string } & CrawlerBaseType;

  cron.schedule(
    '*/30 * * * *',
    async () => {
      const configs = await getCrawlerConfigs();

      await Promise.all(
        configs.map(async (config) => {
          const crawler = new Crawler<CrawlerType>(config);

          configureParseFields(crawler);

          crawler.on('skipItem', async ({ loc, lastmod }) => {
            // check if lastmod is over 365 days old
            const days = calculateDaysSince(new Date(lastmod));
            if (days > 365) {
              return true;
            }

            const product = await prisma.product.findFirst({
              where: {
                loc,
              },
            });

            // product exitst
            if (product) {
              // product is deleted
              if (product.deletedAt) {
                return true;
              }

              if (product.category !== 'Disc' && product.category !== 'Unknown') {
                return true;
              }

              // lastmod is the same
              if (product.lastmod.getTime() === lastmod.getTime()) {
                return true;
              }
            }

            // don't skip
            return false;
          });

          crawler.on(
            'item',
            async ({ loc, lastmod, name, description, imageUrl, price, currency }) => {
              logger.info('Crawled item: ' + loc);
              // upsert, as we do checks in skipItem
              await prisma.product.upsert({
                where: {
                  loc,
                },
                update: {
                  lastmod,
                  updatedAt: new Date(),

                  prices: {
                    create: [
                      {
                        price,
                        currency: currency as Currency,
                        availability: priceToAvailability(price),
                      },
                    ],
                  },
                },
                create: {
                  store: { connect: { id: config.storeId } },

                  loc,
                  lastmod,

                  description,
                  imageUrl,
                  name,

                  prices: {
                    create: [
                      {
                        price,
                        currency: currency as Currency,
                        availability: priceToAvailability(price),
                      },
                    ],
                  },
                },
              });
            },
          );

          return await crawler.crawl();
        }),
      );

      logger.info('Finished crawling');
    },
    { runOnInit: true },
  );
}
