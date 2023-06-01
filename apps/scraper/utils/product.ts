import type { Prisma, PrismaPromise, Product, Store } from "database";
import prisma from "../lib/prisma";
import logger from "./logger";
import { productQueue } from "../queue";
import { SitemapResultItem } from "./sitemap";
import { calculateDaysSince } from "./date";
import { getStoreCrawlDelay } from "./store";

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
      "loc" | "lastmod" | "storeId" | "name" | "description" | "imageUrl"
    >[] = [];

    for (const item of items) {
      const { loc, lastmod } = item;

      // Site specific item condition, and check if lastmod is defined
      if (!itemCondition(item) || !lastmod) {
        continue;
      }

      const prevItem = itemsMap.get(loc);
      // check if any changes at all on lastmod
      if (
        prevItem?.lastmod &&
        lastmod &&
        prevItem.lastmod.getTime() === lastmod.getTime()
      ) {
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
          name: "",
          description: "",
          storeId: store.id,
          imageUrl: "",
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

        const delay = getStoreCrawlDelay(product.store);

        // put updated on queue
        await productQueue.add(
          {
            storeId: store.id,
            loc,
            lastmod,
          },
          {
            delay,
            removeOnComplete: true,
          }
        );
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
            await productQueue.add(
              {
                storeId: store.id,
                loc,
                lastmod,
              },
              {
                delay,
                removeOnComplete: true,
              }
            );
          })
        );

        createArray.length = 0;
      }
    }

    if (createArray.length) {
      await prisma.product.createMany({
        data: createArray,
      });

      // Put all on the queue
      await Promise.all(
        createArray.map(async ({ loc, lastmod, storeId }) => {
          const delay = getStoreCrawlDelay(store);
          await productQueue.add(
            {
              storeId: store.id,
              loc,
              lastmod,
            },
            {
              delay,
              removeOnComplete: true,
            }
          );
        })
      );
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
  const item = await prisma.product.upsert({
    where: {
      loc,
    },
    create: {
      loc,
      lastmod,
      storeId: store.id,
      name: "",
      description: "",
      imageUrl: "",
    },
    update: {
      lastmod,
    },
  });

  if (!itemsMap.has(loc)) {
    itemsMap.set(loc, item);
  }

  const delay = getStoreCrawlDelay(store);

  await productQueue.add(item, {
    delay,
    removeOnComplete: true,
  });
}

export async function createOrUpdateProduct(
  store: Store,
  itemsMap: Map<string, Product>,
  loc: string,
  lastmod: Date
) {
  const existingData = itemsMap.get(loc);

  try {
    if (existingData) {
      if (existingData.lastmod?.getTime() !== lastmod?.getTime()) {
        const item = await prisma.product.update({
          where: { id: existingData.id },
          data: { lastmod },
        });

        const delay = getStoreCrawlDelay(store);
        // add to product queue
        await productQueue.add(item, {
          delay,
          removeOnComplete: true,
        });

        logger.info(`Updated scraped data for ${loc}`);
      }
    } else {
      const item = await prisma.product.create({
        data: {
          loc,
          lastmod,
          storeId: store.id,
          name: "",
          description: "",
          imageUrl: "",
        },
      });

      // put new item back to map
      itemsMap.set(loc, item);

      const delay = getStoreCrawlDelay(store);
      // add to product queue
      await productQueue.add(item, {
        delay,
        removeOnComplete: true,
      });

      logger.info(`Created new scraped data for ${loc}`);
    }
  } catch (error) {
    logger.error(`Error updating scraped data for ${loc}`, error);
  }
}

export function productArrayToMap(
  scrapedData: Product[]
): Map<string, Product> {
  const itemsMap = new Map<string, Product>();

  for (const item of scrapedData) {
    itemsMap.set(item.loc, item);
  }

  return itemsMap;
}
