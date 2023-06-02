import { prisma } from "database";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("siteId");

  if (!id) {
    return NextResponse.json({ error: "Missing siteId" }, { status: 400 });
  }

  const discs = await prisma.disc.findMany({
    where: {
      deletedAt: null,
    },
    include: {
      brand: true,
      _count: {
        select: {
          products: true,
          plastics: true,
          bags: true,
        },
      },
    },
  });

  return NextResponse.json(discs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, slug, speed, glide, turn, fade, type, brandId, imageUrl } =
    body;

  const disc = await prisma.disc.create({
    data: {
      name,
      slug,
      speed,
      glide,
      turn,
      fade,
      brandId,
      type,
      imageUrl,
    },
    include: {
      brand: true,
    },
  });

  return NextResponse.json(disc, { status: 201 });
}
