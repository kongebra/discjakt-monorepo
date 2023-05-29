import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeDiscgolfDynastyProduct(data: ScrapedData) {
  logger.debug("DiscgolfDynasty", { data });
}
