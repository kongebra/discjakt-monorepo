import type { Prisma, PrismaPromise, Product, Site } from "database";
import prisma from "../lib/prisma";
import logger from "./logger";
import { productQueue } from "../queue";
import { SitemapResultItem } from "./sitemap";
import { calculateDaysSince } from "./date";

export async function bulkUpsertProducts({
  site,
  items,
  itemCondition,
  bulkLimit = 32,
}: {
  site: Site & { products: Product[] };
  items: SitemapResultItem[];
  itemCondition: (item: SitemapResultItem) => boolean;
  bulkLimit?: number;
}) {
  try {
    const itemsMap = productArrayToMap(site.products || []);

    const createArray: Pick<
      Product,
      "loc" | "lastmod" | "siteId" | "name" | "description"
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
          siteId: site.id,
        });
      } else {
        await prisma.product.update({
          where: { loc },
          data: {
            lastmod: lastmod,
          },
        });

        // put updated on queue
        await productQueue.add({
          siteId: site.id,
          loc,
          lastmod,
        });
      }

      if (createArray.length >= bulkLimit) {
        logger.profile("createMany");
        await prisma.product.createMany({
          data: createArray,
          skipDuplicates: true,
        });
        logger.profile("createMany");

        // Put all on the queue
        await Promise.all(
          createArray.map(
            async ({ loc, lastmod }) =>
              await productQueue.add({
                siteId: site.id,
                loc,
                lastmod,
              })
          )
        );

        createArray.length = 0;
      }
    }

    if (createArray.length) {
      logger.profile("createMany.final");
      await prisma.product.createMany({
        data: createArray,
      });
      logger.profile("createMany.final");

      // Put all on the queue
      await Promise.all(
        createArray.map(
          async ({ loc, lastmod }) =>
            await productQueue.add({
              siteId: site.id,
              loc,
              lastmod,
            })
        )
      );
    }
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function upsertProduct({
  loc,
  lastmod,
  site,
  itemsMap,
}: {
  loc: string;
  lastmod: Date | null;
  site: Site;
  itemsMap: Map<string, Product>;
}) {
  const item = await prisma.product.upsert({
    where: {
      loc,
    },
    create: {
      loc,
      lastmod,
      site: { connect: { id: site.id } },
      name: "",
      description: "",
    },
    update: {
      lastmod,
    },
  });

  if (!itemsMap.has(loc)) {
    itemsMap.set(loc, item);
  }

  await productQueue.add(item);
}

export async function createOrUpdateProduct(
  site: Site,
  itemsMap: Map<string, Product>,
  loc: string,
  lastmod: Date | null
) {
  const existingData = itemsMap.get(loc);

  try {
    if (existingData) {
      if (existingData.lastmod?.getTime() !== lastmod?.getTime()) {
        const item = await prisma.product.update({
          where: { id: existingData.id },
          data: { lastmod },
        });

        // add to product queue
        await productQueue.add(item);

        logger.info(`Updated scraped data for ${loc}`);
      }
    } else {
      const item = await prisma.product.create({
        data: {
          loc,
          lastmod,
          site: { connect: { id: site.id } },
          name: "",
          description: "",
        },
      });

      // put new item back to map
      itemsMap.set(loc, item);

      // add to product queue
      await productQueue.add(item);

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
