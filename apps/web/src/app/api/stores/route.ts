import { prisma } from "database";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const stores = await prisma.store.findMany({
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  return NextResponse.json(stores);
}
