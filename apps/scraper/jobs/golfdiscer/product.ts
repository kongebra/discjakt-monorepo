import type { Product } from "database";
import logger from "../../utils/logger";
import { ProductQueueData } from "../../queue";

export async function scrapeGolfdiscerProduct(data: ProductQueueData) {
  logger.debug("Golfdiscer", { data });
}
