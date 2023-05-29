import { sitemapHandler } from "../../utils/sitemap";
import logger from "../../utils/logger";

const site = {
  url: "https://spinnvilldg.no",
  name: "Spinnvill DG",
  slug: "spinnvilldg",
};

(async () => {
  try {
    await sitemapHandler({
      site,
      itemCondition: ({ loc }) => {
        return loc.includes("/product-page//");
      },
      sitemapSearch(value) {
        return value.includes("/store-products-sitemap");
      },
    });
  } catch (error) {
    logger.error(`${site.slug} sitemapHandler error:`, error);
  }
})();
