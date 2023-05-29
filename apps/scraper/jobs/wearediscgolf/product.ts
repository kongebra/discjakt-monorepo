import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeWearediscgolfProduct(data: ScrapedData) {
  logger.debug("wearediscgolf", { data });
}
