import { Store } from "database";
import prisma from "../lib/prisma";
import logger from "./logger";

export async function createStoreIfNotExists(
  data: Omit<Store, "id" | "createdAt" | "updatedAt" | "deletedAt">
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

  const result = prisma.store.create({
    data,
    include: {
      products: true,
    },
  });

  logger.debug(`Created store: ${data.slug}`);

  return result;
}
