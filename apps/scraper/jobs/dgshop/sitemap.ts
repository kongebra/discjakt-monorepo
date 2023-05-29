import { sitemapHandler } from "../../utils/sitemap";
import logger from "../../utils/logger";

const site = {
  url: "https://dgshop.no",
  name: "DGShop",
  slug: "dgshop",
};

(async () => {
  try {
    await sitemapHandler({
      site,
      itemCondition: ({ loc, priority, lastmod }) => {
        return priority === "1.0" && loc !== site.url && lastmod !== null;
      },
    });
  } catch (error) {
    logger.error(`${site.slug} sitemapHandler error:`, error);
  }
})();
