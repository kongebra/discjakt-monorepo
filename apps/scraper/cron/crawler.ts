import { Product } from 'database';
import { CrawlerBaseType, CrawlerOptions } from '../crawler';
import prisma from '../lib/prisma';
import logger from '../utils/logger';

type CrawlerConfig = CrawlerOptions<
  Product & { price: number; currency: string } & CrawlerBaseType
> & {
  storeId: number;
};

export async function getCrawlerConfigs(): Promise<CrawlerConfig[]> {
  const stores = await prisma.store.findMany({
    where: {
      deletedAt: null,
    },
  });

  return stores.map((store) => ({
    storeId: store.id,
    baseUrl: store.url,
    logger: logger,
    headers: {
      'User-Agent': 'discjaktbot/1.0 (+https://discjakt.no)',
    },
    sitemapFilter: ({ loc, priority, lastmod }, type) => {
      if (loc === 'https://www.dgshop.no/') {
        return false;
      }

      if (type === 'sitemapindex') {
        const validSitemapIndexOptions = [
          '/store-products-sitemap',
          '/sitemap_products_',
          '/product-sitemap',
        ];

        return validSitemapIndexOptions.some((option) => loc.includes(option));
      }

      if (loc.includes('dgshop.no')) {
        return priority === '1.0' && !!lastmod;
      }

      const validOptions = ['/product-page/', '/produkt/', '/products/'];

      return validOptions.some((option) => loc.includes(option));
    },
  }));
}
