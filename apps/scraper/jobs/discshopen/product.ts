import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeDiscshopenProduct(data: Product) {
  logger.debug("Discshopen", { data });
}
