import { NextResponse } from "next/server";
import { prisma } from "database";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("siteId");

  if (!id) {
    const products = await prisma.product.findMany({});

    return NextResponse.json(products);
  }

  const siteId = Number(id);

  if (isNaN(siteId) || siteId < 1) {
    return NextResponse.json(
      { error: "siteId must be a number" },
      { status: 400 }
    );
  }

  const data = await prisma.product.findMany({ where: { siteId } });

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

  const resp = await prisma.product.deleteMany({
    where: {
      siteId,
    },
  });

  return NextResponse.json(resp);
}
