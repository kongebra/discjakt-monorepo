import { sitemapHandler } from "../../utils/sitemap";
import logger from "../../utils/logger";

const site = {
  url: "https://wearediscgolf.no",
  name: "We are Disc Golf",
  slug: "wearediscgolf",
};

(async () => {
  try {
    await sitemapHandler({
      site,
      itemCondition: ({ loc }) => {
        return loc.includes("/produkt/");
      },
      sitemapSearch(value) {
        return value.includes("/product-sitemap");
      },
    });
  } catch (error) {
    logger.error(`${site.slug} sitemapHandler error:`, error);
  }
})();
