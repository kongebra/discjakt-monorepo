import { sitemapHandler } from "../../utils/sitemap";
import logger from "../../utils/logger";

const site = {
  url: "https://discshopen.no",
  name: "Disc Shopen",
  slug: "discshopen",
};

(async () => {
  try {
    await sitemapHandler({
      site,
      itemCondition: ({ loc }) => {
        return loc.includes("/produkt/");
      },
      sitemapSearch(value) {
        return value.includes("/product-sitemap.xml");
      },
    });
  } catch (error) {
    logger.error(`${site.slug} sitemapHandler error:`, error);
  }
})();
