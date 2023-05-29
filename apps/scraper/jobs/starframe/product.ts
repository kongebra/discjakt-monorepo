import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeStarframeProduct(data: ScrapedData) {
  logger.debug("Starframe", { data });
}
