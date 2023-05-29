import prisma from "../../lib/prisma";
import { createSiteIfNotExists } from "../../utils/site";
import { fetchSitemap } from "../../utils/sitemap";
import {
  scrapedDataArrayToMap,
  updateScrapedData,
} from "../../utils/scrapedData";
import logger from "../../utils/logger";
import { calculateDaysSince } from "../../utils/date";

async function scrapeAceshopSitemap() {
  const baseUrl = "https://aceshop.no";
  const name = "Aceshop";
  const slug = "aceshop";

  try {
    const site = await createSiteIfNotExists({ name, slug, url: baseUrl });
    const itemsMap = scrapedDataArrayToMap(site.scrapedData || []);

    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    const sitemapItems = await fetchSitemap(sitemapUrl);

    for (const item of sitemapItems) {
      const { loc, lastmod } = item;

      // check if loc includes /products
      if (loc.includes("/products/")) {
        // check if lastmod is set
        if (lastmod) {
          // calculate days since lastmod
          const daysSinceLastmod = calculateDaysSince(lastmod);
          // check if under 1 year
          if (daysSinceLastmod < 365) {
            await updateScrapedData(site, itemsMap, loc, lastmod);
          }
        }
      }
    }
  } catch (error) {
    logger.error("Aceshop scraping error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

(async () => {
  try {
    await scrapeAceshopSitemap();
  } catch (error) {
    logger.error("Error occurred during scraping:", error);
  }
})();
