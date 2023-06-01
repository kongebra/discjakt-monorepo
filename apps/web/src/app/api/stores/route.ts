import { prisma } from "database";
import { NextResponse } from "next/server";

export async function GET() {
  const stores = await prisma.store.findMany({
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

  return NextResponse.json(stores);
}
