import * as cron from "node-cron";
import logger from "../utils/logger";
import { productCleanup } from "./product-cleanup";
import { sitemapHandlerArgsArray } from "./constants";
import { sitemapHandler } from "./sitemap-handler";

export function initCronJobs() {
  // every minute
  logger.info("Starting cron job for product cleanup, running");
  cron.schedule("*/1 * * * *", productCleanup);

  for (const sitemapHandlerArgs of sitemapHandlerArgsArray) {
    if (!sitemapHandlerArgs.disabled) {
      logger.info(
        `Starting cron job for ${sitemapHandlerArgs.store.slug}, running every 30 minutes`
      );

      // every 30 minutes
      cron.schedule(
        "*/30 * * * *",
        async () => {
          await sitemapHandler(sitemapHandlerArgs);
        },
        {
          runOnInit: true,
        }
      );
    }
  }
}
