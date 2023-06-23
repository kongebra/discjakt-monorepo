import axios from 'axios';
import { load } from 'cheerio';
import { PrismaClient, Product, Store } from 'database';

export interface CrawlerConfig {
  store: Store;
}

export interface ILogger {
  debug: (...args: any[]) => void;
  log: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

export class CrawlerEngine {
  private config: CrawlerConfig;
  private prisma: PrismaClient;
  private logger: ILogger;

  constructor(config: CrawlerConfig, prisma: PrismaClient, logger: ILogger) {
    this.config = config;
    this.prisma = prisma;
    this.logger = logger;
  }

  async crawl() {
    try {
      // Fetch the sitemap
      const sitemapXml = await this.fetchSite(`${this.config.store.url}/sitemap.xml`);
      const productUrls = this.getProductUrlsFromSitemap(sitemapXml);

      // Filter the URLs based on lastmod timestamp
      const filteredUrls = await this.filterUrlsByLastmod(productUrls);

      for (const url of filteredUrls) {
        // Fetch and parse data from each URL
        const html = await this.fetchSite(url);
        const product = this.parseSiteData(html);

        if (product) {
          // Save the data
          await this.saveProducts([product]);
        }
      }
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  private filterUrlsByLastmod(productUrls: string[]): string[] {
    return [];
  }

  private getProductUrlsFromSitemap(sitemapXml: string): string[] {
    return [];
  }

  private async fetchSite(url: string): Promise<string> {
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error(`Failed to fetch ${url}`);
    }

    return response.data;
  }

  private parseSiteData(html: string): Product | null {
    // Use cheerio to parse the site data
    const $ = load(html);

    // Use cheerio to parse the site data

    return null;
  }

  private async saveProducts(products: Product[]) {
    // Use prisma to save the product data
    await Promise.all(
      products.map(async (product) => {
        await this.prisma.product.upsert({
          where: {
            loc: product.loc,
          },
          update: {
            lastmod: product.lastmod,
            updatedAt: new Date(),
          },
          create: {
            store: { connect: { id: this.config.store.id } },
            loc: product.loc,
            lastmod: product.lastmod,
            description: product.description,
            imageUrl: product.imageUrl,
            name: product.name,
          },
        });
      }),
    );
  }

  private handleError(error: Error) {
    // Handle errors
    this.logger.error(error.message, error);
  }
}
