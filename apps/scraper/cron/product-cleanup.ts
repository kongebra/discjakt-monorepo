import { prisma } from "database";
import logger from "../utils/logger";
import { productQueue } from "../queue";

export async function productCleanup() {
  try {
    const products = await prisma.product.findMany({
      where: {
        prices: {
          none: {},
        },
      },
      take: 16,
    });

    for (const product of products) {
      logger.info(`Adding product to queue:`, {
        lastmod: product.lastmod,
        loc: product.loc,
        siteId: product.siteId,
      });

      await productQueue.add({
        lastmod: product.lastmod,
        loc: product.loc,
        siteId: product.siteId,
      });
    }
  } catch (error) {
    logger.error("product-cleanup error:", error);
  }
}
