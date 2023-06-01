import { prisma, Prisma } from "database";
import { NextResponse } from "next/server";

export async function GET() {
  const where: Prisma.ProductFindManyArgs["where"] = {
    AND: [
      {
        OR: [
          {
            prices: {
              none: {},
            },
          },
          {
            prices: {
              every: {
                createdAt: {
                  // check if older than 24 hours
                  lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
                },
              },
            },
          },
        ],
      },
      {
        deletedAt: null,
      },
    ],
  };

  const products = await prisma.product.findMany({
    where,
    select: {
      updatedAt: true,
    },
    take: 16,
    orderBy: {
      updatedAt: "asc",
    },
  });

  return NextResponse.json(products);
}
