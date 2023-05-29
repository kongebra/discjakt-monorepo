import type { Product } from "database";
import logger from "../../utils/logger";
import { ProductQueueData } from "../../queue";

export async function scrapeFrisbeesorProduct(data: ProductQueueData) {
  logger.debug("Frisbeesor", { data });
}
