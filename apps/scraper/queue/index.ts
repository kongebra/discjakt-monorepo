import Queue from 'bull';
import { Currency, Product } from 'database';
import { Crawler, CrawlerBaseType } from '../crawler';
import { getCrawlerConfigs } from '../cron/crawler';
import prisma from '../lib/prisma';
import logger from '../utils/logger';
import { priceToAvailability } from '../utils/price';

// bull: Message queue
if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not set');
}

export type ProductQueueData = {
  storeId: number;
  loc: string;
  lastmod: Date | null;
};

export const productQueue = new Queue<ProductQueueData>('product', process.env.REDIS_URL, {
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
});

export function initQueue() {
  productQueue.process(5, async (job) => {
    try {
      const { data } = job;

      const product = await prisma.product.findFirst({
        where: {
          AND: [
            {
              loc: data.loc,
            },
            {
              deletedAt: null,
            },
          ],
        },
      });

      if (!product) {
        logger.debug('Product not found, discarding job:', { loc: data.loc });
        job.discard();

        return;
      }

      const site = await prisma.store.findUnique({
        where: { id: data.storeId },
      });

      if (!site) {
        throw new Error(`Site with id ${data.storeId} not found`);
      }

      const configs = await getCrawlerConfigs();
      const config = configs.find((config) => config.storeId === data.storeId);

      if (config) {
        const crawler = new Crawler<
          Product & { price: number; currency: string } & CrawlerBaseType
        >(config);

        crawler.on(
          'item',
          async ({ loc, lastmod, name, description, imageUrl, price, currency }) => {
            logger.info('Crawled item via Queue:' + loc);
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

        await crawler.crawlProductSite({
          loc: product.loc,
          lastmod: product.lastmod,
          priority: '1.0',
        });
      } else {
        logger.warn('No crawler config found for store:', { storeId: data.storeId });
      }
    } catch (error) {
      logger.error('Error scraping product (initQueue):', error);
    }
  });
}
