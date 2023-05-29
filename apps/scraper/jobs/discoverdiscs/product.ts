import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeDiscoverDiscsProduct(data: Product) {
  logger.debug("DiscoverDiscs", { data });
}
