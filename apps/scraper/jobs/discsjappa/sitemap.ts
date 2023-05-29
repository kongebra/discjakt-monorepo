import prisma from "../../lib/prisma";
import { createSiteIfNotExists } from "../../utils/site";
import { fetchSitemap } from "../../utils/sitemap";
import {
  scrapedDataArrayToMap,
  updateScrapedData,
} from "../../utils/scrapedData";
import logger from "../../utils/logger";
import { calculateDaysSince } from "../../utils/date";
import axios from "axios";
import { load } from "cheerio";

export async function prefetchSitemap(url: string) {
  try {
    const response = await axios.get(url);
    const xml = response.data;
    const $ = load(xml, { xmlMode: true });

    const items: string[] = [];

    $("sitemap").each((index, element) => {
      const loc = $(element).find("loc").text();

      items.push(loc);
    });

    return items;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error fetching sitemap from ${url}: ${error.message}`);
      throw error;
    } else {
      console.error(`Error fetching sitemap from ${url}: ${String(error)}`);
      throw new Error(String(error));
    }
  }
}

async function scrapeDiscSjappaSitemap() {
  const baseUrl = "https://discsjappa.no";
  const name = "Disc Sjappa";
  const slug = "discsjappa";

  try {
    const site = await createSiteIfNotExists({ name, slug, url: baseUrl });
    const itemsMap = scrapedDataArrayToMap(site.scrapedData || []);

    const sitemapUrl = `${baseUrl}/sitemap.xml`;
    const prefetchItems = await prefetchSitemap(sitemapUrl);

    const productSitemap = prefetchItems.find((item) =>
      item.includes("/sitemap_products_")
    );

    if (!productSitemap) {
      throw new Error("No product sitemap found");
    }

    const sitemapItems = await fetchSitemap(productSitemap);

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
    logger.error("discsjappa scraping error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

(async () => {
  try {
    await scrapeDiscSjappaSitemap();
  } catch (error) {
    logger.error("Error occurred during scraping:", error);
  }
})();
