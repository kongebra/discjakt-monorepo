import logger from "../utils/logger";
import { sitemapHandler as sitemapHandlerFunc } from "../utils/sitemap";
import { SitemapHandlerArrayArgs } from "./constants";

export async function sitemapHandler({
  disabled,
  ...args
}: SitemapHandlerArrayArgs) {
  try {
    logger.info(`${args.store.slug} sitemapHandler starting...`);

    await sitemapHandlerFunc(args);

    logger.info(`${args.store.slug} sitemapHandler done`);
  } catch (error) {
    logger.error(`${args.store.slug} sitemapHandler error:`, error);
  }
}
