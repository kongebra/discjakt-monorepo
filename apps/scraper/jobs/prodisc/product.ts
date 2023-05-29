import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeProdiscProduct(data: ScrapedData) {
  logger.debug("Prodisc", { data });
}
