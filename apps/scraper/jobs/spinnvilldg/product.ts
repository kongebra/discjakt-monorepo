import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeSpinnvilldgProduct(data: Product) {
  logger.debug("Spinnvilldg", { data });
}
