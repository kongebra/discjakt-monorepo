import type { Product } from "database";
import logger from "../../utils/logger";
import { ProductQueueData } from "../../queue";

export async function scrapeSendskiveProduct(data: ProductQueueData) {
  logger.debug("Sendskive", { data });
}
