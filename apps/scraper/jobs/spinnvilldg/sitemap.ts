import prisma from "../../lib/prisma";
import { createSiteIfNotExists } from "../../utils/site";
import { fetchSitemap } from "../../utils/sitemap";
import { scrapedDataArrayToMap, updateProduct } from "../../utils/scrapedData";
import logger from "../../utils/logger";
import { calculateDaysSince } from "../../utils/date";

async function scrapeSpinnvilldgSitemap() {
  const baseUrl = "https://spinnvilldg.no";
  const name = "spinnvilldg";
  const slug = "spinnvilldg";

  try {
    const site = await createSiteIfNotExists({ name, slug, url: baseUrl });
    const itemsMap = scrapedDataArrayToMap(site.scrapedData || []);

    const sitemapUrl = `${baseUrl}/store-products-sitemap.xml`;
    const sitemapItems = await fetchSitemap(sitemapUrl);

    for (const item of sitemapItems) {
      const { loc, lastmod } = item;

      // check if loc includes /products
      if (loc.includes("/product-page/")) {
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
    logger.error("spinnvilldg scraping error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

(async () => {
  try {
    await scrapeSpinnvilldgSitemap();
  } catch (error) {
    logger.error("Error occurred during scraping:", error);
  }
})();
