import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeGolfdiscerProduct(data: ScrapedData) {
  logger.debug("Golfdiscer", { data });
}
