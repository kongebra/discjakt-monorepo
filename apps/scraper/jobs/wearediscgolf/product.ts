import type { Product } from "database";
import logger from "../../utils/logger";
import { ProductQueueData } from "../../queue";

export async function scrapeWearediscgolfProduct(data: ProductQueueData) {
  logger.debug("wearediscgolf", { data });
}
