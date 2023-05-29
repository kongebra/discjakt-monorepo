import { sitemapHandler } from "../../utils/sitemap";
import logger from "../../utils/logger";

const site = {
  url: "https://prodisc.no",
  name: "Prodisc",
  slug: "prodisc",
};

(async () => {
  try {
    await sitemapHandler({
      site,
      itemCondition: ({ loc }) => {
        return loc.includes("/products/");
      },
      sitemapSearch(value) {
        return value.includes("/sitemap_products_1.xml");
      },
    });
  } catch (error) {
    logger.error(`${site.slug} sitemapHandler error:`, error);
  }
})();
