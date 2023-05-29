import { NextResponse } from "next/server";
import { prisma } from "database";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("siteId");

  if (!id) {
    const scrapedData = await prisma.scrapedData.findMany({});

    return NextResponse.json(scrapedData);
  }

  const siteId = Number(id);

  if (isNaN(siteId) || siteId < 1) {
    return NextResponse.json(
      { error: "siteId must be a number" },
      { status: 400 }
    );
  }

  const data = await prisma.scrapedData.findMany({ where: { siteId } });

  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("siteId");

  if (!id) {
    return NextResponse.json({ error: "Missing siteId" }, { status: 400 });
  }

  const siteId = Number(id);

  if (isNaN(siteId) || siteId < 1) {
    return NextResponse.json(
      { error: "siteId must be a number" },
      { status: 400 }
    );
  }

  const resp = await prisma.scrapedData.deleteMany({
    where: {
      siteId,
    },
  });

  return NextResponse.json(resp);
}
