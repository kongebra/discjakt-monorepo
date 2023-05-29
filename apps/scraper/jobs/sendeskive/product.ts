import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeSendskiveProduct(data: ScrapedData) {
  logger.debug("Sendskive", { data });
}
