import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeDgshopProduct(data: ScrapedData) {
  logger.debug("Dgshop", { data });
}
