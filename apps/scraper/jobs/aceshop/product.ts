import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeAceshopProduct(data: Product) {
  logger.info("aceshop", { data });
}
