import Queue from 'bull';
import prisma from '../lib/prisma';
import logger from '../utils/logger';
import { getCrawlDelay, parseRobotsTxt } from '../utils/robotsTxt';
import { scrapeProduct } from '../utils/scraper';

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

      const robots = parseRobotsTxt(site.robotsTxt);
      const crawlDelaySecs = getCrawlDelay(robots, 'discjakt');

      // This starts the scraping process
      await scrapeProduct(data);
    } catch (error) {
      logger.error('Error scraping product (initQueue):', error);
    }
  });
}
