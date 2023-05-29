import { sitemapHandler } from "../../utils/sitemap";
import logger from "../../utils/logger";

const site = {
  url: "https://frisbeesor.no",
  name: "Frisbee Sør",
  slug: "frisbeesor",
};

(async () => {
  try {
    await sitemapHandler({
      site,
      itemCondition: ({ loc }) => {
        return loc.includes("/product/");
      },
      sitemapSearch(value) {
        return value.includes("/product-sitemap");
      },
    });
  } catch (error) {
    logger.error(`${site.slug} sitemapHandler error:`, error);
  }
})();
