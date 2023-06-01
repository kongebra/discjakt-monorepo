import { NextResponse } from "next/server";
import { prisma } from "database";

type Props = {
  params: {
    productId: string;
  };
};

export async function GET(req: Request, { params: { productId } }: Props) {
  const id = parseInt(productId);

  if (!id) {
    return NextResponse.json("404", { status: 404 });
  }

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      prices: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return NextResponse.json(product);
}
