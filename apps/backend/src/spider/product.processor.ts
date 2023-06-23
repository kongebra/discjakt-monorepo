import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { Currency } from 'database';
import { PrismaService } from '../prisma/prisma.service';
import { ProductScraperService } from './product-scraper/product-scraper.service';
import { QueueCounterService } from './queue-counter/queue-counter.service';

@Processor('product')
export class ProductProcessor {
  private readonly logger = new Logger(ProductProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly productScraperService: ProductScraperService,
    private readonly queueCounterService: QueueCounterService,
  ) {}

  @Process('product')
  async product(job: Job<{ storeId: number; loc: string; lastmod: string }>) {
    const { storeId, loc, lastmod } = job.data;

    try {
      const dbProduct = await this.prisma.product.findUnique({
        where: {
          loc,
        },
        include: {
          prices: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });

      if (dbProduct) {
        if (new Date(lastmod).getTime() === dbProduct?.lastmod.getTime()) {
          this.logger.debug(
            `Product ${loc} has not changed since last scrape. Skipping.`,
          );
          return;
        }
      }

      // Try to scrape the product, handle specific errors
      let scrapedProduct;
      try {
        scrapedProduct = await this.productScraperService.scrapeProduct(loc);
      } catch (error) {
        if (error.message.includes('404')) {
          this.logger.error(
            `Couldn't find product at ${loc}, marking as deleted`,
          );

          await this.prisma.product.update({
            where: { loc },
            data: { deletedAt: new Date() },
          });

          return;
        } else {
          throw error;
        }
      }

      let shouldCreatePrice = true;

      if (dbProduct && dbProduct.prices.length > 0) {
        const latestPrice = dbProduct.prices[0];
        const today = new Date();
        const latestPriceDate = new Date(latestPrice.createdAt);

        if (
          latestPriceDate.getDate() === today.getDate() &&
          latestPriceDate.getMonth() === today.getMonth() &&
          latestPriceDate.getFullYear() === today.getFullYear() &&
          latestPrice.price === scrapedProduct.price?.price &&
          latestPrice.availability === scrapedProduct.price?.availability
        ) {
          this.logger.debug(
            `Price for ${loc} has not changed today. Skipping creation.`,
          );
          shouldCreatePrice = false;
        }
      }

      const { price, ...rest } = scrapedProduct;

      await this.prisma.product.upsert({
        where: {
          loc,
        },
        create: {
          loc,
          lastmod: new Date(lastmod),
          description: rest.description || '',
          imageUrl: rest.imageUrl || '',
          name: rest.name || '',
          store: {
            connect: {
              id: storeId,
            },
          },

          prices: shouldCreatePrice
            ? {
                create: [
                  {
                    price: price?.price || 0,
                    availability: price?.availability || 'OutOfStock',
                    currency: (price?.currency as Currency) || 'NOK',
                  },
                ],
              }
            : undefined,
        },
        update: {
          ...rest,
          lastmod: new Date(lastmod),

          prices: shouldCreatePrice
            ? {
                create: [
                  {
                    price: price?.price || 0,
                    availability: price?.availability || 'OutOfStock',
                    currency: (price?.currency as Currency) || 'NOK',
                  },
                ],
              }
            : undefined,
        },
      });

      this.logger.debug(`Finished processing job ${loc}`);
    } catch (error) {
      this.logger.error("Couldn't process job", error);
    } finally {
      this.queueCounterService.decrement(storeId);
    }
  }
}
