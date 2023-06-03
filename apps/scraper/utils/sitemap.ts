import axios from "axios";
import { load } from "cheerio";
import { createStoreIfNotExists } from "./store";
import type { Store } from "database";
import { bulkUpsertProducts } from "./product";
import logger from "./logger";

export type SitemapResultItem = {
  loc: string;
  lastmod: Date | null;
  changefreq: string | null;
  priority: string | null;
};

export async function fetchSitemap(url: string) {
  try {
    const response = await axios.get(url);
    const xml = response.data;
    const $ = load(xml, { xmlMode: true });

    const items: SitemapResultItem[] = [];

    $("url").each((index, element) => {
      const loc = $(element).find("loc").text();
      const lastmod = $(element).find("lastmod").text();
      const changefreq = $(element).find("changefreq").text();
      const priority = $(element).find("priority").text();

      items.push({
        loc,
        lastmod: lastmod ? new Date(lastmod) : null,
        changefreq,
        priority,
      });
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

export type SitemapHandlerArgs = {
  store: Pick<Store, "name" | "slug" | "url">;
  itemCondition(item: SitemapResultItem): boolean;
  sitemaps?: string[];
  sitemapSearch?: (value: string) => boolean;
};

export async function sitemapHandler({
  store: { name, slug, url },
  itemCondition,
  sitemaps,
  sitemapSearch,
}: SitemapHandlerArgs) {
  try {
    logger.debug("Starting sitemapHandler");
    const _site = await createStoreIfNotExists({ name, slug, url });
    const items = await sitemapFetchter({ url, sitemaps, sitemapSearch });

    await bulkUpsertProducts({
      store: _site,
      items,
      itemCondition,
      bulkLimit: 64,
    });
  } catch (error) {
    logger.error(`${slug} scraping error:`, { error, slug });
  }
}

async function sitemapFetchter({
  url,
  sitemaps,
  sitemapSearch,
}: {
  url: string;
  sitemaps?: string[];
  sitemapSearch?: (value: string) => boolean;
}) {
  // we have multiple sitemaps
  if (sitemaps) {
    const items2d = await Promise.all(
      sitemaps.map(async (sitemap) => await fetchSitemap(sitemap))
    );

    return items2d.flat();
  }

  // we have a sitemap with productpage with timestamps-filter or something
  if (sitemapSearch) {
    const sitemapUrl = `${url}/sitemap.xml`;
    const prefetchedStitemaps = await prefetchSitemap(sitemapUrl);
    const productSitemap = prefetchedStitemaps.find(sitemapSearch);

    if (!productSitemap) {
      throw new Error("No product sitemap found");
    }

    return await fetchSitemap(productSitemap);
  }

  // normal sitemap
  return await fetchSitemap(`${url}/sitemap.xml`);
}

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
