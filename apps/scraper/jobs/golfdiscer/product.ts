import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeGolfdiscerProduct(data: Product) {
  logger.debug("Golfdiscer", { data });
}
