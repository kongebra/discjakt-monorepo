import type { Product } from "database";
import logger from "../../utils/logger";
import { ProductQueueData } from "../../queue";

export async function scrapeSpinnvilldgProduct(data: ProductQueueData) {
  logger.debug("Spinnvilldg", { data });
}
