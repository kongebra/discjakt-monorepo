import { Product } from 'database';
import { Crawler, CrawlerBaseType } from '../crawler';
import { CrawlerParserFuncHelper } from '../crawler/helpers';

export function configureParseFields(
  crawler: Crawler<Product & { price: number; currency: string } & CrawlerBaseType>,
) {
  crawler.parseField('name', CrawlerParserFuncHelper.product.name);
  crawler.parseField('description', CrawlerParserFuncHelper.product.description);
  crawler.parseField('imageUrl', CrawlerParserFuncHelper.product.imageUrl);
  crawler.parseField('price', CrawlerParserFuncHelper.product.price);
  crawler.parseField('currency', CrawlerParserFuncHelper.product.currency);
}
