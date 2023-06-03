import { SitemapItem } from './types';

export function ensureUrlNotEndingWithSlash(url: string) {
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function isSitemapItem(item: Partial<SitemapItem>): item is SitemapItem {
  return 'loc' in item && 'lastmod' in item && 'priority' in item;
}
