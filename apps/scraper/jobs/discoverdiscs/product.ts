import type { ScrapedData } from "database";
import logger from "../../utils/logger";

export async function scrapeDiscoverDiscsProduct(data: ScrapedData) {
  logger.debug("DiscoverDiscs", { data });
}
