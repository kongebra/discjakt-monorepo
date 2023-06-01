import { Prisma, prisma } from "database";
import logger from "../utils/logger";
import { productQueue } from "../queue";
import { getStoreCrawlDelay } from "../utils/store";

export async function productCleanup() {
  try {
    const where: Prisma.ProductFindManyArgs["where"] = {
      AND: [
        {
          OR: [
            {
              prices: {
                none: {},
              },
            },
            {
              prices: {
                every: {
                  createdAt: {
                    // check if older than 24 hours
                    lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                  },
                },
              },
            },
          ],
        },
        {
          deletedAt: null,
        },
      ],
    };

    const count = await prisma.product.count({
      where,
    });

    logger.info(`product-cleanup count: ${count}`);

    const products = await prisma.product.findMany({
      where,
      include: {
        store: true,
      },
      take: 128,
      orderBy: {
        updatedAt: "asc",
      },
    });

    // update updatedAt so that it doesn't get picked up again
    await prisma.product.updateMany({
      where: {
        id: {
          in: products.map((product) => product.id),
        },
      },
      data: {
        updatedAt: new Date(),
      },
    });

    // convert storeId in products to map<storeId, number>
    const storeIdMap = new Map<number, number>();

    for (const product of products) {
      // check if storeId is in map
      if (!storeIdMap.has(product.storeId)) {
        storeIdMap.set(product.storeId, 0);
      }

      logger.info(`Adding product to queue:`, {
        loc: product.loc,
      });

      // get current count for store
      const count = storeIdMap.get(product.storeId) || 0;
      // get delay for store and multiply by count
      const delay = getStoreCrawlDelay(product.store) * count;
      // increment count
      storeIdMap.set(product.storeId, count + 1);

      await productQueue.add(
        {
          lastmod: product.lastmod,
          loc: product.loc,
          storeId: product.storeId,
        },
        {
          delay,
        }
      );
    }
  } catch (error) {
    logger.error("product-cleanup error:", error);
  }
}
