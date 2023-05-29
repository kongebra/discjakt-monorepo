import type { Product } from "database";
import logger from "../../utils/logger";
import { ProductQueueData } from "../../queue";

export async function scrapeDiscoverDiscsProduct(data: ProductQueueData) {
  logger.debug("DiscoverDiscs", { data });
}
