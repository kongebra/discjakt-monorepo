import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeStarframeProduct(data: Product) {
  logger.debug("Starframe", { data });
}
