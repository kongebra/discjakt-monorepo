import type { Product } from "database";
import logger from "../../utils/logger";
import { ProductQueueData } from "../../queue";

export async function scrapeAceshopProduct(data: ProductQueueData) {
  logger.info("aceshop", { data });
}
