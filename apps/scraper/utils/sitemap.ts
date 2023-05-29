import { Product, Site } from "database";
import axios from "axios";
import { load } from "cheerio";

type ResultItem = {
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

    const items: ResultItem[] = [];

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
