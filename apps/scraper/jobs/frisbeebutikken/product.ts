import type { Product } from "database";
import logger from "../../utils/logger";
import { ProductQueueData } from "../../queue";

export async function scrapeFrisbeebutikkenProduct(data: ProductQueueData) {
  logger.debug("Frisbeebutikken", { data });
}
