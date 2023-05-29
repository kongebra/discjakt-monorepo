import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeSendskiveProduct(data: Product) {
  logger.debug("Sendskive", { data });
}
