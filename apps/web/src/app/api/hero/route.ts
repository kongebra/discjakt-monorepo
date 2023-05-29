import { prisma } from "database";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const resp = await prisma.scrapedData.deleteMany({
    where: {
      siteId: 1,
    },
  });

  return NextResponse.json(resp);
}
