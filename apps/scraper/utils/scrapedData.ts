import type { ScrapedData, Site } from "database";
import prisma from "../lib/prisma";
import logger from "./logger";

export async function updateScrapedData(
  site: Site,
  itemsMap: Map<string, ScrapedData>,
  loc: string,
  lastmod: Date | null
): Promise<void> {
  const existingData = itemsMap.get(loc);

  try {
    if (existingData) {
      if (existingData.lastmod?.getTime() !== lastmod?.getTime()) {
        await prisma.scrapedData.update({
          where: { id: existingData.id },
          data: { lastmod },
        });

        logger.info(`Updated scraped data for ${loc}`);
      }
    } else {
      await prisma.scrapedData.create({
        data: {
          loc,
          lastmod,
          site: { connect: { id: site.id } },
        },
      });

      logger.info(`Created new scraped data for ${loc}`);
    }
  } catch (error) {
    logger.error(`Error updating scraped data for ${loc}`, error);
  }
}

export function scrapedDataArrayToMap(
  scrapedData: ScrapedData[]
): Map<string, ScrapedData> {
  const itemsMap = new Map<string, ScrapedData>();

  for (const item of scrapedData) {
    itemsMap.set(item.loc, item);
  }

  return itemsMap;
}
