import type { Product } from "database";
import logger from "../../utils/logger";
import { ProductQueueData } from "../../queue";

export async function scrapeDiscshopenProduct(data: ProductQueueData) {
  logger.debug("Discshopen", { data });
}
