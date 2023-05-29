import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeFrisbeesorProduct(data: Product) {
  logger.debug("Frisbeesor", { data });
}
