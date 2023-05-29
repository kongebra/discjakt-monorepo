import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeDiscsjappaProduct(data: ScrapedData) {
  logger.debug("Discsjappa", { data });
}
