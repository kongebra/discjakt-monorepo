import prisma from "../../lib/prisma";
import { createSiteIfNotExists } from "../../utils/site";
import { fetchSitemap } from "../../utils/sitemap";
import { scrapedDataArrayToMap, updateProduct } from "../../utils/scrapedData";
import logger from "../../utils/logger";
import { calculateDaysSince } from "../../utils/date";

async function scrapeDgshopSitemap() {
  const baseUrl = "https://dgshop.no";
  const name = "DGShop";
  const slug = "dgshop";

  try {
    const site = await createSiteIfNotExists({ name, slug, url: baseUrl });
    const itemsMap = scrapedDataArrayToMap(site.scrapedData || []);

    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    const sitemapItems = await fetchSitemap(sitemapUrl);

    for (const item of sitemapItems) {
      const { loc, lastmod, priority } = item;

      // check if priority is 1.0 and if loc is not the base url
      if (priority === "1.0" && loc !== baseUrl) {
        // check if lastmod is set
        if (lastmod) {
          // calculate days since lastmod
          const daysSinceLastmod = calculateDaysSince(lastmod);
          // check if under 1 year
          if (daysSinceLastmod < 365) {
            await updateProduct(site, itemsMap, loc, lastmod);
          }
        }
      }
    }
  } catch (error) {
    logger.error("dgshop scraping error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

(async () => {
  try {
    await scrapeDgshopSitemap();
  } catch (error) {
    logger.error("Error occurred during scraping:", error);
  }
})();
