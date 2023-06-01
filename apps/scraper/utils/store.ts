import { Store } from "database";
import prisma from "../lib/prisma";
import logger from "./logger";
import axios from "axios";
import { parseRobotsTxt, getCrawlDelay } from "./robotsTxt";

export async function createStoreIfNotExists(
  data: Pick<Store, "slug" | "url" | "name">
) {
  const existingStore = await prisma.store.findUnique({
    where: { slug: data.slug },
    include: {
      products: true,
    },
  });

  if (existingStore) {
    return existingStore;
  }

  const response = await axios.get(`${data.url}/robots.txt`);
  const robotsTxt = response.data as string;

  const result = prisma.store.create({
    data: {
      ...data,
      robotsTxt,
    },
    include: {
      products: true,
    },
  });

  logger.debug(`Created store: ${data.slug}`);

  return result;
}

export function getStoreCrawlDelay(store: Store) {
  const robots = parseRobotsTxt(store.robotsTxt);
  const crawlDelaySecsStr = getCrawlDelay(robots, "discjakt");
  const delaySecs = crawlDelaySecsStr ? parseFloat(crawlDelaySecsStr) || 0 : 0;

  return delaySecs * 1000;
}
