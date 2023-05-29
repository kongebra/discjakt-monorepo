import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeFrisbeebutikkenProduct(data: ScrapedData) {
  logger.debug("Frisbeebutikken", { data });
}
