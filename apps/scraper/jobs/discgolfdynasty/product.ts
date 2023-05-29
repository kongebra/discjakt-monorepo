import type { Product } from "database";
import logger from "../../utils/logger";
import { ProductQueueData } from "../../queue";

export async function scrapeDiscgolfDynastyProduct(data: ProductQueueData) {
  logger.debug("DiscgolfDynasty", { data });
}
