import logger from "../utils/logger";
import { sitemapHandler as sitemapHandlerFunc } from "../utils/sitemap";
import { SitemapHandlerArrayArgs } from "./constants";

export async function sitemapHandler({
  disabled,
  ...args
}: SitemapHandlerArrayArgs) {
  try {
    if (disabled) {
      return;
    }

    await sitemapHandlerFunc(args);

    logger.info(`${args.site.slug} sitemapHandler done`);
  } catch (error) {
    logger.error(`${args.site.slug} sitemapHandler error:`, error);
  }
}
