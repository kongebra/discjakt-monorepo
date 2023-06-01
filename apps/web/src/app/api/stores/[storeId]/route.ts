import { Store, prisma } from "database";
import { NextResponse } from "next/server";

type Props = {
  params: {
    storeId: string;
  };
};

export async function GET(_req: Request, { params: { storeId } }: Props) {
  const id = Number(storeId);
  if (!storeId || isNaN(id)) {
    return NextResponse.json({ error: "Invalid storeId" }, { status: 400 });
  }

  const store = await prisma.store.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          products: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
  });

  if (!store) {
    return NextResponse.json(
      { error: `Store with id ${storeId} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(store);
}

export async function PUT(req: Request, { params: { storeId } }: Props) {
  const id = Number(storeId);
  if (!storeId || isNaN(id)) {
    return NextResponse.json({ error: "Invalid storeId" }, { status: 400 });
  }

  const body = (await req.json()) as Store;

  if (id !== body.id) {
    return NextResponse.json({ error: "Invalid storeId" }, { status: 400 });
  }

  const { name, url, slug } = body;

  const store = await prisma.store.update({
    where: {
      id,
    },
    data: {
      name,
      url,
      slug,
    },
    include: {
      _count: {
        select: {
          products: {
            where: {
              deletedAt: null,
            },
          },
        },
      },
    },
  });

  if (!store) {
    return NextResponse.json(
      { error: `Store with id ${storeId} not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(store);
}
