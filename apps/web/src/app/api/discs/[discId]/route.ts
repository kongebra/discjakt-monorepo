import { Disc, prisma } from "database";
import { NextResponse } from "next/server";

type Props = {
  params: {
    discId: string;
  };
};

export async function GET(_req: Request, { params: { discId } }: Props) {
  const id = Number(discId);
  if (!discId || isNaN(id)) {
    return NextResponse.json({ error: "Invalid discId" }, { status: 400 });
  }

  const disc = await prisma.disc.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          products: true,
          plastics: true,
          bags: true,
          users: true,
        },
      },
      brand: true,
    },
  });

  if (!disc) {
    return NextResponse.json(
      { error: `Disc with id ${discId} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(disc);
}

export async function PUT(req: Request, { params: { discId } }: Props) {
  const id = Number(discId);
  if (!discId || isNaN(id)) {
    return NextResponse.json({ error: "Invalid discId" }, { status: 400 });
  }

  const body = (await req.json()) as Disc;

  if (id !== body.id) {
    return NextResponse.json({ error: "Invalid discId" }, { status: 400 });
  }

  const { name, slug, speed, glide, turn, fade, brandId, type, imageUrl } =
    body;

  const Disc = await prisma.disc.update({
    where: {
      id,
    },
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
      _count: {
        select: {
          products: true,
          plastics: true,
          bags: true,
          users: true,
        },
      },
      brand: true,
    },
  });

  if (!Disc) {
    return NextResponse.json(
      { error: `Disc with id ${discId} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(Disc);
}
