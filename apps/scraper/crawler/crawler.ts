import axios from 'axios';
import Bottleneck from 'bottleneck';
import type { AnyNode, Cheerio, CheerioAPI } from 'cheerio';
import { load } from 'cheerio';
import { DEFAULT_USER_AGENT, ROBOTS_TXT_PATH, SITEMAP_XML_PATH } from './constants';
import type {
  CrawlerBaseType,
  CrawlerEvents,
  CrawlerFieldParser,
  CrawlerOptions,
  CrawlerSitemapFilterFunc,
  CrawlerSitemapItemFilterFunc,
  Logger,
  SitemapItem,
} from './types';
import { ensureUrlNotEndingWithSlash, isSitemapItem } from './utils';

export class Crawler<T extends CrawlerBaseType> {
  private baseUrl: string;
  private delayMs: number = 0;
  private sitemapItems: SitemapItem[] = [];
  private fieldParsers: Map<keyof T, CrawlerFieldParser<T, keyof T>> = new Map();
  private events: Partial<CrawlerEvents<T>> = {};
  private robotsTxt: string | null = null;
  private disallowedPages: Set<string> = new Set();
  private chunkSize: number = 5;
  private maxRequestPerSecond: number = 10;
  private logger: Logger;
  private headers: Record<string, string>;
  private userAgent: string;
  private sitemapFilter?: CrawlerSitemapFilterFunc;
  private filterSitemapItems?: CrawlerSitemapItemFilterFunc;

  constructor(options: CrawlerOptions<T>) {
    this.baseUrl = ensureUrlNotEndingWithSlash(options.baseUrl);
    this.chunkSize = options.chunkSize ?? this.chunkSize;
    this.maxRequestPerSecond = options.maxRequestsPerSecond ?? this.maxRequestPerSecond;
    this.logger = options.logger || console;
    this.headers = options.headers || {};
    this.userAgent = this.headers['User-Agent'] || DEFAULT_USER_AGENT;
    this.sitemapFilter = options.sitemapFilter;
    this.filterSitemapItems = options.sitemapItemFilter;
  }

  private async fetchRobotsTxt() {
    const robotsUrl = `${this.baseUrl}/${ROBOTS_TXT_PATH}`;

    try {
      this.events.robotsTxtFetchStarted?.();
      this.logger.debug('robotsTxtFetchStarted');

      const response = await axios.get(robotsUrl, {
        headers: this.headers,
      });
      this.robotsTxt = response.data;

      this.events.robotsTxtFetchFinished?.();
      this.logger.debug('robotsTxtFetchFinished');
    } catch (error) {
      this.events.error?.(error as Error, 'fetching robots.txt', robotsUrl);
      this.logger.error('Error fetching robots.txt', error);
    }
  }

  private parseRobotsTxt(filter: (item: string) => boolean) {
    try {
      const parsedRobotsTxt = this.robotsTxt?.split('\n') ?? [];

      let isUserAgentAllowed = false;
      let crawlDelayInSeconds: number | null = null;

      for (const line of parsedRobotsTxt) {
        if (filter(line)) {
          const [field, value] = line.split(':').map((item) => item.trim());

          isUserAgentAllowed = this.parseUserAgent(isUserAgentAllowed, field, value);
          this.parseDisallow(isUserAgentAllowed, field, value);
          crawlDelayInSeconds = this.parseCrawlDelay(
            isUserAgentAllowed,
            field,
            value,
            crawlDelayInSeconds,
          );
        }
      }

      this.delayMs = crawlDelayInSeconds ? crawlDelayInSeconds * 1000 : this.delayMs;
    } catch (error) {
      this.events.error?.(error as Error, 'parsing robots.txt');
      this.logger.error('Error parsing robots.txt', error);
    }
  }

  private parseUserAgent(isUserAgentAllowed: boolean, field: string, value: string): boolean {
    if (field.toLowerCase() === 'user-agent') {
      if (value.toLowerCase() === this.userAgent || value === DEFAULT_USER_AGENT) {
        isUserAgentAllowed = true;
      } else {
        isUserAgentAllowed = false;
      }
    }

    return isUserAgentAllowed;
  }

  private parseDisallow(isUserAgentAllowed: boolean, field: string, value: string): void {
    if (isUserAgentAllowed && field.toLowerCase() === 'disallow') {
      this.disallowedPages.add(this.baseUrl + value);
    }
  }

  private parseCrawlDelay(
    isUserAgentAllowed: boolean,
    field: string,
    value: string,
    crawlDelayInSeconds: number | null,
  ): number | null {
    if (isUserAgentAllowed && field.toLowerCase() === 'crawl-delay') {
      crawlDelayInSeconds = parseInt(value, 10);
    }

    return crawlDelayInSeconds;
  }

  public parseSitemap(filter: (item: SitemapItem, type: 'urlset' | 'sitemapindex') => boolean) {
    const fetchSitemap = async () => {
      const sitemapUrl = `${this.baseUrl}/${SITEMAP_XML_PATH}`;

      try {
        const response = await axios.get(sitemapUrl, {
          headers: this.headers,
        });
        if (response.status !== 200) {
          throw new Error(`Error fetching sitemap: ${response.status}`);
        }

        const $ = load(response.data);

        const rootElement = $('urlset, sitemapindex');
        if (rootElement.is('sitemapindex')) {
          await this.parseSitemapIndex($, rootElement, filter);
        } else {
          this.parseUrlset($, rootElement, filter);
        }
      } catch (error) {
        this.events.error?.(error as Error, 'fetching sitemap', sitemapUrl);
        this.logger.error('Error fetching sitemap', error);
      }
    };

    return fetchSitemap();
  }

  private parseUrlset(
    $: CheerioAPI,
    rootElement: Cheerio<AnyNode>,
    filter: (item: SitemapItem, type: 'urlset' | 'sitemapindex') => boolean,
  ) {
    rootElement.find('url').each((_index, element) => {
      const $url = $(element);
      const item: Partial<SitemapItem> = {
        loc: this.getFieldText($, $url, 'loc'),
        lastmod: new Date(this.getFieldText($, $url, 'lastmod')),
        priority: this.getFieldText($, $url, 'priority'),
      };

      if (isSitemapItem(item) && filter(item as SitemapItem, 'urlset')) {
        this.sitemapItems.push(item as SitemapItem);
      }
    });
  }

  private async parseSitemapIndex(
    $: CheerioAPI,
    rootElement: Cheerio<AnyNode>,
    filter: (item: SitemapItem, type: 'urlset' | 'sitemapindex') => boolean,
  ) {
    const sitemaps = rootElement.find('sitemap');

    for (let index = 0; index < sitemaps.length; index++) {
      const element = sitemaps[index];
      const $sitemap = $(element);
      const sitemapLoc = this.getFieldText($, $sitemap, 'loc');

      if (filter({ loc: sitemapLoc } as SitemapItem, 'sitemapindex')) {
        const sitemapResponse = await axios.get(sitemapLoc, {
          headers: this.headers,
        });
        if (sitemapResponse.status !== 200) {
          throw new Error(`Error fetching sitemap: ${sitemapResponse.status}`);
        }

        const $sitemapUrls = load(sitemapResponse.data)('url');

        $sitemapUrls.each((_index, urlElement) => {
          const $url = $(urlElement);
          const item: Partial<SitemapItem> = {
            loc: this.getFieldText($, $url, 'loc'),
            lastmod: new Date(this.getFieldText($, $url, 'lastmod')),
            priority: this.getFieldText($, $url, 'priority'),
          };

          if (filter(item as SitemapItem, 'urlset')) {
            this.sitemapItems.push(item as SitemapItem);
          }
        });
      }
    }
  }

  public parseField<K extends keyof T>(field: K, parser: CrawlerFieldParser<T, K>) {
    this.fieldParsers.set(field, parser);
  }

  public on<Event extends keyof CrawlerEvents<T>>(event: Event, handler: CrawlerEvents<T>[Event]) {
    this.events[event] = handler;
  }

  public async crawl() {
    if (this.sitemapFilter) {
      await this.parseSitemap(this.sitemapFilter);
    }

    const limiter = new Bottleneck({
      minTime: 1000 / this.maxRequestPerSecond,
    });

    // Handle robots.txt before crawling
    try {
      await this.fetchRobotsTxt();
      this.parseRobotsTxt((line) => line.trim() !== '');
    } catch (error) {
      // If robots.txt is not available or returns a non-200 status code, log the message and proceed with the crawling
      this.events.error?.(error as Error, 'fetching robots.txt', `${this.baseUrl}/robots.txt`);
      this.logger.error('Error fetching robots.txt', error);
    }

    const chunks = this.chunkArray(this.sitemapItems, this.chunkSize);
    this.logger.debug(`Crawling ${this.sitemapItems.length} pages in ${chunks.length} chunks`);

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (item) => {
          const retryCount = 3; // Define a retry count
          for (let i = 0; i < retryCount; i++) {
            try {
              // Check if we want to skip item
              if (this.events.skipItem) {
                const skippingItem = await this.events.skipItem(item);
                if (skippingItem) {
                  this.logger.debug(`Skipping item: ${item.loc}`);
                  return;
                }
              }

              // Check if this page is disallowed
              if (this.disallowedPages.has(item.loc)) {
                this.logger.debug(`Skipping disallowed page: ${item.loc}`);
                return;
              }

              await limiter.schedule(async () => {
                const response = await axios.get(item.loc, {
                  headers: this.headers,
                });
                if (response.status !== 200) {
                  if (response.status === 404) {
                    this.events.pageNotFound?.(item);
                    this.logger.debug(`Page not found: ${item.loc}`);
                    return;
                  } else {
                    this.events.error?.(
                      new Error(`Error fetching ${item.loc}: ${response.status}`),
                      'fetching page',
                      item.loc,
                    );
                    this.logger.error(`Error fetching ${item.loc}: ${response.status}`);

                    return;
                  }
                }
                const $ = load(response.data);

                const parsedItem: Partial<T> = {};

                parsedItem.loc = item.loc;
                parsedItem.lastmod = item.lastmod;
                parsedItem.priority = item.priority;

                for (const [field, parser] of this.fieldParsers) {
                  try {
                    parsedItem[field] = parser($, response);
                  } catch (error) {
                    this.events.error?.(
                      error as Error,
                      `parsing field: ${field as string}`,
                      item.loc,
                    );
                    this.logger.error('Error parsing field', { field, loc: item.loc });
                    return;
                  }
                }

                this.events.item?.(parsedItem as T, response);
              });

              break; // Break the retry loop if request is successful
            } catch (error) {
              this.events.error?.(error as Error, 'fetching page', item.loc);
              this.logger.error('Error fetching page', { error, item });

              if (i === retryCount - 1) {
                this.logger.error('Retry count exceeded', { error, item });
                throw error; // Throw error if it's the last retry
              }
            }
          }
        }),
      );

      // Delay before next chunk of requests
      await this.delayRequest();
    }
  }

  private chunkArray(array: SitemapItem[], size: number) {
    const result = [];

    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }

    return result;
  }

  private getFieldText($: CheerioAPI, $url: ReturnType<CheerioAPI>, field: keyof T) {
    const element = $url.find(field as string);
    return element.length > 0 ? element.text() : '';
  }

  private delayRequest() {
    return new Promise<void>((resolve) => setTimeout(resolve, this.delayMs));
  }
}
