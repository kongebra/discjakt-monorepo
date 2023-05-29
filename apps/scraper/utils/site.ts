import { Site } from "database";
import prisma from "../lib/prisma";

export async function createSiteIfNotExists(data: Omit<Site, "id">) {
  const existingSite = await prisma.site.findUnique({
    where: { slug: data.slug },
    include: {
      scrapedData: true,
    },
  });

  if (existingSite) {
    return existingSite;
  }

  return prisma.site.create({
    data,
    include: {
      scrapedData: true,
    },
  });
}
