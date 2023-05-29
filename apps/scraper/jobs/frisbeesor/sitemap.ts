import prisma from "../../lib/prisma";
import { createSiteIfNotExists } from "../../utils/site";
import { fetchSitemap } from "../../utils/sitemap";
import { scrapedDataArrayToMap, updateProduct } from "../../utils/scrapedData";
import logger from "../../utils/logger";
import { calculateDaysSince } from "../../utils/date";

async function scrapeFrisbeesorSitemap() {
  const baseUrl = "https://frisbeesor.no";
  const name = "Frisbee Skr";
  const slug = "frisbeesor";

  try {
    const site = await createSiteIfNotExists({ name, slug, url: baseUrl });
    const itemsMap = scrapedDataArrayToMap(site.scrapedData || []);

    const sitemapUrls = [
      `${baseUrl}/product-sitemap1.xml`,
      `${baseUrl}/product-sitemap2.xml`,
      `${baseUrl}/product-sitemap3.xml`,
      `${baseUrl}/product-sitemap4.xml`,
    ];

    for (const sitemapUrl of sitemapUrls) {
      const sitemapItems = await fetchSitemap(sitemapUrl);

      for (const item of sitemapItems) {
        const { loc, lastmod } = item;

        // check if loc includes /produkt
        if (loc.includes("/produkt/")) {
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
    }
  } catch (error) {
    logger.error("Frisbeesor scraping error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

(async () => {
  try {
    await scrapeFrisbeesorSitemap();
  } catch (error) {
    logger.error("Error occurred during scraping:", error);
  }
})();
