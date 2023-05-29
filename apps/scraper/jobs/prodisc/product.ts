import type { Product } from "database";
import logger from "../../utils/logger";

export async function scrapeProdiscProduct(data: Product) {
  logger.debug("Prodisc", { data });
}
