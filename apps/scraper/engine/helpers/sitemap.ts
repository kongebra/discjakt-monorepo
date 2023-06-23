import axios, { type AxiosRequestConfig } from 'axios';
import { load, type AnyNode, type Cheerio, type CheerioAPI } from 'cheerio';

export type SitemapItem = {
  loc: string;
  lastmod: string;
  priority: string;
};

/**
 * Fetches the sitemap.xml file from the specified URL asynchronously.
 * @param url - The URL of the website to fetch the sitemap.xml file from.
 * @param config - Optional Axios request configuration.
 * @returns A promise that resolves to the sitemap.xml content.
 * @throws If there is an error while fetching the sitemap.xml file.
 */
export async function fetchSitemapAsync(url: string, config?: AxiosRequestConfig) {
  const sitemapUrl = new URL('/sitemap.xml', url);

  try {
    const response = await axios.get(sitemapUrl.toString(), config);
    if (response.status !== 200) {
      throw new Error(`Error fetching sitemap.xml for ${url}. Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    throw new Error(`Error fetching sitemap.xml for ${url}: ${(error as Error).message}`);
  }
}

/**
 * Parses the sitemap content and extracts sitemap items.
 * @param data - The content of the sitemap.
 * @param config - Optional Axios request configuration for fetching sitemaps.
 * @returns An array of SitemapItem objects representing the sitemap items.
 * @throws If there is an error while parsing the sitemap.
 */
export async function parseSitemapAsync(data: string, config?: AxiosRequestConfig) {
  const $ = load(data);

  const rootElement = $('urlset', 'sitemapindex');
  if (rootElement.is('sitemapindex')) {
    try {
      return await parseSitemapIndexAsync($, rootElement, config);
    } catch (error) {
      console.error(`Error parsing sitemap index: ${(error as Error).message}`);
      return [];
    }
  }

  if (rootElement.is('urlset')) {
    return parseSitemapUrlset($, rootElement);
  }

  throw new Error('Invalid sitemap format. Expecting <urlset> or <sitemapindex> root element.');
}

/**
 * Parses a sitemap index and fetches and parses individual sitemaps.
 * @param $ - The Cheerio instance for parsing the HTML/XML.
 * @param sitemapIndexElement - The sitemapindex element to parse.
 * @param config - Optional Axios request configuration for fetching sitemaps.
 * @returns An array of SitemapItem objects representing the sitemap items from all sitemaps.
 * @throws If there is an error while parsing the sitemap index or fetching individual sitemaps.
 */
async function parseSitemapIndexAsync(
  $: CheerioAPI,
  sitemapIndexElement: Cheerio<AnyNode>,
  config?: AxiosRequestConfig,
) {
  const sitemapElements = sitemapIndexElement.find('sitemap');
  const result: SitemapItem[] = [];
  const fetchPromises: Promise<void>[] = [];

  for (const sitemapElement of sitemapElements) {
    const $sitemap = $(sitemapElement);
    const sitemapUrl = $sitemap.find('loc').text();

    const fetchPromise = axios
      .get(sitemapUrl, config)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`Error fetching sitemap from ${sitemapUrl}. Status: ${response.status}`);
        }

        const $$ = load(response.data);
        const urlsetRoot = $$('urlset');
        const sitemapItems = parseSitemapUrlset($$, urlsetRoot);
        result.push(...sitemapItems);
      })
      .catch((error) => {
        console.error(`Error fetching sitemap from ${sitemapUrl}: ${error.message}`);
      });

    fetchPromises.push(fetchPromise);
  }

  await Promise.all(fetchPromises);

  return result;
}

/**
 * Parses a urlset element and extracts the sitemap items.
 * @param $ - The Cheerio instance for parsing the HTML/XML.
 * @param rootElement - The urlset element to parse.
 * @returns An array of SitemapItem objects representing the sitemap items.
 */
function parseSitemapUrlset($: CheerioAPI, rootElement: Cheerio<AnyNode>) {
  const result: SitemapItem[] = [];

  const urlElements = rootElement.find('url');

  for (const urlElement of urlElements) {
    const $url = $(urlElement);

    const loc = $url.find('loc').text();
    const lastmod = $url.find('lastmod').text() || '';
    const priority = $url.find('priority').text() || '';

    result.push({
      loc,
      lastmod,
      priority,
    });
  }

  return result;
}
