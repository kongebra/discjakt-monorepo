import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeWearediscgolfProduct(data: Product) {
  logger.debug("wearediscgolf", { data });
}
