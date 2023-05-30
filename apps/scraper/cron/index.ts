import * as cron from "node-cron";
import logger from "../utils/logger";
import { productCleanup } from "./product-cleanup";
import { sitemapHandlerArgsArray } from "./constants";
import { sitemapHandler } from "./sitemap-handler";

export function initCronJobs() {
  // every minute
  logger.info("Starting cron job for product cleanup, running");
  cron.schedule("*/1 * * * *", productCleanup);

  let index = 0;
  const spacingTImeSeconds = 10;
  for (const sitemapHandlerArgs of sitemapHandlerArgsArray) {
    setTimeout(() => {
      logger.info(
        `Starting cron job for ${sitemapHandlerArgs.site.slug}, running every 30 minutes`
      );

      // every 30 minutes
      cron.schedule(
        "*/30 * * * *",
        async () => await sitemapHandler(sitemapHandlerArgs)
      );
    }, 1000 * spacingTImeSeconds * index++);
  }
}
