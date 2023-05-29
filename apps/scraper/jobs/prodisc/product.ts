import type { Product } from "database";
import logger from "../../utils/logger";
import { ProductQueueData } from "../../queue";

export async function scrapeProdiscProduct(data: ProductQueueData) {
  logger.debug("Prodisc", { data });
}
