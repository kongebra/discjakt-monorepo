import { prisma } from "database";
import { NextResponse } from "next/server";

type Props = {
  params: {
    storeId: string;
  };
};

export async function GET(req: Request, { params: { storeId } }: Props) {
  if (!storeId) {
    return NextResponse.json({ error: "Missing storeId" }, { status: 400 });
  }

  const store = await prisma.store.findUnique({
    where: {
      id: Number(storeId),
    },
    include: {
      _count: {
        select: {
          products: true,
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
