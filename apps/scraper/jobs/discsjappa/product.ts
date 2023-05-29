import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeDiscsjappaProduct(data: Product) {
  logger.debug("Discsjappa", { data });
}
