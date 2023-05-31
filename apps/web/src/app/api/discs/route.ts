import { prisma } from "database";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("siteId");

  if (!id) {
    return NextResponse.json({ error: "Missing siteId" }, { status: 400 });
  }

  const discs = await prisma.disc.findMany({
    where: {},
  });

  return NextResponse.json(discs);
}
