import { AxiosResponse } from 'axios';
import { CheerioAPI } from 'cheerio';

export type SitemapItem = {
  loc: string;
  lastmod: Date;
  priority: string;
};

export type CrawlerParserFunc<T> = (cheerio: CheerioAPI, response: AxiosResponse) => T;

export type CrawlerFieldParser<T, K extends keyof T> = CrawlerParserFunc<T[K]>;

export type Logger = {
  debug: (...args: any[]) => void;
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

export type CrawlerOptions<T> = {
  baseUrl: string;
  chunkSize?: number;
  maxRequestsPerSecond?: number;
  logger?: Logger;
  headers?: Record<string, string>;
  sitemapFilter?: CrawlerSitemapFilterFunc;
  sitemapItemFilter?: CrawlerSitemapItemFilterFunc;
};

export type CrawlerEvents<T> = {
  item: (item: T, response: AxiosResponse) => void;
  error: (error: Error, context: string, url?: string) => void;
  crawlStarted: () => void;
  crawlFinished: () => void;
  pageScrapeStarted: (url: string) => void;
  pageScrapeFinished: (url: string) => void;
  sitemapFetchStarted: () => void;
  sitemapFetchFinished: () => void;
  robotsTxtFetchStarted: () => void;
  robotsTxtFetchFinished: () => void;
  pageNotFound: (item: SitemapItem) => void;
  skipItem: (item: SitemapItem) => Promise<boolean | void>;

  jsonLd: (url: string, data: JsonLdProductObject) => void;
};

export type CrawlerBaseType = SitemapItem;

export type CrawlerSitemapFilterFunc = (
  item: SitemapItem,
  type: 'urlset' | 'sitemapindex',
) => boolean;

export type CrawlerSitemapItemFilterFunc = (item: SitemapItem) => Promise<boolean> | boolean;

export type JsonLdProductObject = {
  '@type': 'Product';

  name: string;
  url: string;
  image: string | string[];
  description: string;

  offers: {
    '@type': 'Offer';
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
  }[];

  [key: string]: any;
};
