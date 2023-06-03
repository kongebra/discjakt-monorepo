import type { Product, Store } from 'database';
import prisma from '../lib/prisma';
import { productQueue } from '../queue';
import { calculateDaysSince } from './date';
import logger from './logger';
import { SitemapResultItem } from './sitemap';
import { getStoreCrawlDelay } from './store';

export async function bulkUpsertProducts({
  store,
  items,
  itemCondition,
  bulkLimit = 32,
}: {
  store: Store & { products: Product[] };
  items: SitemapResultItem[];
  itemCondition: (item: SitemapResultItem) => boolean;
  bulkLimit?: number;
}) {
  try {
    const itemsMap = productArrayToMap(store.products || []);

    const createArray: Pick<
      Product,
      'loc' | 'lastmod' | 'storeId' | 'name' | 'description' | 'imageUrl'
    >[] = [];

    for (const item of items) {
      const { loc, lastmod } = item;

      // Site specific item condition, and check if lastmod is defined
      if (!itemCondition(item) || !lastmod) {
        continue;
      }

      const prevItem = itemsMap.get(loc);
      // check if any changes at all on lastmod
      if (prevItem?.lastmod && lastmod && prevItem.lastmod.getTime() === lastmod.getTime()) {
        continue;
      }

      // calculate days since lastmod
      const daysSinceLastmod = calculateDaysSince(lastmod);
      // check if over 1 year
      if (daysSinceLastmod >= 365) {
        continue;
      }

      if (!itemsMap.has(loc)) {
        createArray.push({
          loc,
          lastmod: lastmod,
          name: '',
          description: '',
          storeId: store.id,
          imageUrl: '',
        });
      } else {
        // lastmod has changed
        const product = await prisma.product.update({
          where: { loc },
          data: {
            lastmod: lastmod,
          },
          include: {
            store: true,
          },
        });

        // TODO: Find out if we want to do a page crawl here or wait until midnight-cron-job
      }

      if (createArray.length >= bulkLimit) {
        await prisma.product.createMany({
          data: createArray,
          skipDuplicates: true,
        });

        // Put all on the queue
        await Promise.all(
          createArray.map(async ({ loc, lastmod }) => {
            const delay = getStoreCrawlDelay(store);
            // Vi legger til på denne køen kun når vi lager nye, eller ved midnatt
            await productQueue.add(
              {
                storeId: store.id,
                loc,
                lastmod,
              },
              {
                delay,
              },
            );
          }),
        );

        createArray.length = 0;
      }
    }

    if (createArray.length) {
      await prisma.product.createMany({
        data: createArray,
      });

      const storeCount: Map<number, number> = new Map();

      // Put all on the queue
      createArray.map(async ({ loc, lastmod, storeId }) => {
        if (!storeCount.has(storeId)) {
          // start on 1
          storeCount.set(storeId, 1);
        }

        // get count
        const count = storeCount.get(storeId)!;
        // calculate delay
        const delay = getStoreCrawlDelay(store) * count;
        // increment count
        storeCount.set(storeId, count + 1);

        // Vi legger til på denne køen kun når vi lager nye, eller ved midnatt
        await productQueue.add(
          {
            storeId: store.id,
            loc,
            lastmod,
          },
          {
            delay,
          },
        );
      });
    }
  } catch (error) {
    throw error;
  }
}

export async function upsertProduct({
  loc,
  lastmod,
  store,
  itemsMap,
}: {
  loc: string;
  lastmod: Date;
  store: Store;
  itemsMap: Map<string, Product>;
}) {
  const exists = await prisma.product.findUnique({
    where: {
      loc,
    },
  });

  if (!exists) {
    const item = await prisma.product.create({
      data: {
        loc,
        lastmod,
        storeId: store.id,
        name: '',
        description: '',
        imageUrl: '',
      },
    });

    if (!itemsMap.has(loc)) {
      itemsMap.set(loc, item);
    }

    const delay = getStoreCrawlDelay(store);
    await productQueue.add(item, {
      delay,
    });
  } else {
    if (exists.lastmod?.getTime() !== lastmod?.getTime()) {
      const item = await prisma.product.update({
        where: { id: exists.id },
        data: { lastmod, updatedAt: new Date() },
      });

      // TODO: Do we perform page crawl here or wait until midnight-cron-job?
      // const delay = getStoreCrawlDelay(store);
      // // add to product queue
      // await productQueue.add(item, {
      //   delay,
      // });
    }
  }
}

export async function createOrUpdateProduct(
  store: Store,
  itemsMap: Map<string, Product>,
  loc: string,
  lastmod: Date,
) {
  const existingData = itemsMap.get(loc);

  try {
    if (existingData) {
      if (existingData.lastmod?.getTime() !== lastmod?.getTime()) {
        const item = await prisma.product.update({
          where: { id: existingData.id },
          data: { lastmod },
        });

        // TODO: Do we perform page crawl here or wait until midnight-cron-job?
        // const delay = getStoreCrawlDelay(store);
        // // add to product queue
        // await productQueue.add(item, {
        //   delay,
        // });

        logger.info(`Updated scraped data for ${loc}`);
      }
    } else {
      const item = await prisma.product.create({
        data: {
          loc,
          lastmod,
          storeId: store.id,
          name: '',
          description: '',
          imageUrl: '',
        },
      });

      // put new item back to map
      itemsMap.set(loc, item);

      const delay = getStoreCrawlDelay(store);
      // add to product queue
      await productQueue.add(item, {
        delay,
      });

      logger.info(`Created new scraped data for ${loc}`);
    }
  } catch (error) {
    logger.error(`Error updating scraped data for ${loc}`, error);
  }
}

export function productArrayToMap(scrapedData: Product[]): Map<string, Product> {
  const itemsMap = new Map<string, Product>();

  for (const item of scrapedData) {
    itemsMap.set(item.loc, item);
  }

  return itemsMap;
}
