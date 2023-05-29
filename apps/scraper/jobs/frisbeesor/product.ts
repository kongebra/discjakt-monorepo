import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeFrisbeesorProduct(data: ScrapedData) {
  logger.debug("Frisbeesor", { data });
}
