import { prisma } from "database";
import logger from "../utils/logger";
import { productQueue } from "../queue";

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
        prices: {
          none: {},
        },
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

      await productQueue.add({
        lastmod: product.lastmod,
        loc: product.loc,
        storeId: product.storeId,
      });
    }
  } catch (error) {
    logger.error("product-cleanup error:", error);
  }
}
