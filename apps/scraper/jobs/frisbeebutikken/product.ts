import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeFrisbeebutikkenProduct(data: Product) {
  logger.debug("Frisbeebutikken", { data });
}
