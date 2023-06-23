import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AnyNode, Cheerio, CheerioAPI, load } from 'cheerio';
import { SitemapItem } from '../types';

@Injectable()
export class SitemapService {
  private readonly logger = new Logger(SitemapService.name);

  constructor(private readonly http: HttpService) {}

  public async fetchAndParse(baseUrl: string): Promise<SitemapItem[]> {
    const normalizedBaseUrl = this.normalizeBaseUrl(baseUrl);
    const url = `${normalizedBaseUrl}/sitemap.xml`;

    try {
      const startTime = process.hrtime(); // Start measuring execution time
      const response = await this.http.axiosRef.get(url);
      const xml = response.data;
      const $ = load(xml, { xmlMode: true });

      const rootElement = $('urlset, sitemapindex');

      if (rootElement.is('sitemapindex')) {
        this.logger.debug('Found sitemapindex');
        const result = await this.parseSitemapIndexAsync(
          $,
          rootElement,
          normalizedBaseUrl,
        );
        const endTime = process.hrtime(startTime);
        this.logger.debug(
          `Parsing time: ${endTime[0]}s ${endTime[1] / 1000000}ms`,
        );
        return result;
      }

      if (rootElement.is('urlset')) {
        const result = this.parseSitemapUrlset($, rootElement);
        const endTime = process.hrtime(startTime);
        this.logger.debug(
          `Parsing time: ${endTime[0]}s ${endTime[1] / 1000000}ms`,
        );
        return result;
      }

      return [];
    } catch (error) {
      this.logger.error(
        `Error fetching or parsing sitemap from ${url}: ${
          (error as Error).message
        }`,
      );
      return [];
    }
  }

  private async parseSitemapIndexAsync(
    $: CheerioAPI,
    sitemapIndexElement: Cheerio<AnyNode>,
    baseUrl: string,
  ): Promise<SitemapItem[]> {
    const sitemapElements = sitemapIndexElement.find('sitemap');
    const fetchPromises: Promise<SitemapItem[]>[] = [];

    for (const sitemapElement of sitemapElements.toArray()) {
      const $sitemap = $(sitemapElement);
      const sitemapUrl = $sitemap.find('loc').text();
      const normalizedSitemapUrl = this.normalizeSitemapUrl(
        baseUrl,
        sitemapUrl,
      );

      const fetchPromise = this.fetchAndParseSitemap(normalizedSitemapUrl);
      fetchPromises.push(fetchPromise);
    }

    const results = await Promise.all(fetchPromises);
    const mergedResults: SitemapItem[] = results.flat();

    return mergedResults;
  }

  private async fetchAndParseSitemap(
    sitemapUrl: string,
  ): Promise<SitemapItem[]> {
    try {
      const startTime = process.hrtime(); // Start measuring execution time
      const response = await this.http.axiosRef.get(sitemapUrl);
      if (response.status !== 200) {
        throw new Error(
          `Error fetching sitemap from ${sitemapUrl}. Status: ${response.status}`,
        );
      }

      const xml = response.data;
      const $ = load(xml, { xmlMode: true });
      const rootElement = $('urlset');
      const result = this.parseSitemapUrlset($, rootElement);

      const endTime = process.hrtime(startTime);
      this.logger.debug(
        `Parsing time: ${endTime[0]}s ${endTime[1] / 1000000}ms`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Error fetching or parsing sitemap from ${sitemapUrl}: ${
          (error as Error).message
        }`,
      );
      return [];
    }
  }

  private parseSitemapUrlset(
    $: CheerioAPI,
    rootElement: Cheerio<AnyNode>,
  ): SitemapItem[] {
    const result: SitemapItem[] = [];
    const urlElements = rootElement.find('url');

    for (const urlElement of urlElements.toArray()) {
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

  private normalizeBaseUrl(baseUrl: string): string {
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  private normalizeSitemapUrl(baseUrl: string, sitemapUrl: string): string {
    return sitemapUrl.startsWith('/') ? `${baseUrl}${sitemapUrl}` : sitemapUrl;
  }
}
