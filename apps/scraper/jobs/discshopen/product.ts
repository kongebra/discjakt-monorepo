import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeDiscshopenProduct(data: ScrapedData) {
  logger.debug("Discshopen", { data });
}
