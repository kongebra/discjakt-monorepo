import type { Product } from "database";
import logger from "../../utils/logger";
import { ProductQueueData } from "../../queue";

export async function scrapeStarframeProduct(data: ProductQueueData) {
  logger.debug("Starframe", { data });
}
