import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeAceshopProduct(data: ScrapedData) {
  logger.info("aceshop", { data });
}
