import { prisma } from "database";
import logger from "../utils/logger";
import { productQueue } from "../queue";
import { getCrawlDelay, parseRobotsTxt } from "../utils/robotsTxt";
import { getStoreCrawlDelay } from "../utils/store";

export async function productCleanup() {
  try {
    const count = await prisma.product.count({
      where: {
        prices: {
          none: {},
        },
      },
    });

    logger.info(`product-cleanup count: ${count}`);

    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            prices: {
              none: {},
            },
          },
          {
            deletedAt: null,
          },
        ],
      },
      include: {
        store: true,
      },
      take: 16,
      orderBy: {
        updatedAt: "asc",
      },
    });

    for (const product of products) {
      logger.info(`Adding product to queue:`, {
        loc: product.loc,
      });

      const delay = getStoreCrawlDelay(product.store);

      await productQueue.add(
        {
          lastmod: product.lastmod,
          loc: product.loc,
          storeId: product.storeId,
        },
        {
          removeOnComplete: true,
          delay,
        }
      );
    }
  } catch (error) {
    logger.error("product-cleanup error:", error);
  }
}
