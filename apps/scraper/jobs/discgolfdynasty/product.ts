import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeDiscgolfDynastyProduct(data: Product) {
  logger.debug("DiscgolfDynasty", { data });
}
