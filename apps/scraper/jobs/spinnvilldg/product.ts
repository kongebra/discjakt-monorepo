import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeSpinnvilldgProduct(data: ScrapedData) {
  logger.debug("Spinnvilldg", { data });
}
