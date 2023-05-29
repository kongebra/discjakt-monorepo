import { sitemapHandler } from "../../utils/sitemap";
import logger from "../../utils/logger";

const site = {
  url: "https://frisbeebutikken.no",
  name: "Frisbeebutikken",
  slug: "frisbeebutikken",
};

(async () => {
  try {
    await sitemapHandler({
      site,
      itemCondition: ({ loc }) => {
        return loc.includes("/products/");
      },
    });
  } catch (error) {
    logger.error(`${site.slug} sitemapHandler error:`, error);
  }
})();
