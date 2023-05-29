import Queue from "bull";
import { prisma } from "database";
import { scrapeProduct } from "../utils/scraper";
import logger from "../utils/logger";

// bull: Message queue
if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set");
}

export type ProductQueueData = {
  siteId: number;
  loc: string;
  lastmod: Date | null;
};

export const productQueue = new Queue<ProductQueueData>(
  "product",
  process.env.REDIS_URL,
  {
    defaultJobOptions: {
      removeOnComplete: true,
    },
  }
);

productQueue.process(5, async (job) => {
  try {
    const { data } = job;

    const site = await prisma.site.findUnique({
      where: { id: data.siteId },
    });

    if (!site) {
      throw new Error(`Site with id ${data.siteId} not found`);
    }

    await scrapeProduct(data);
  } catch (error) {
    logger.error("Error scraping product:", error);
  }
});
