import { NextResponse } from "next/server";
import { Product, prisma } from "database";

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

export async function PUT(req: Request, { params: { productId } }: Props) {
  const id = parseInt(productId);

  if (!id) {
    return NextResponse.json("404", { status: 404 });
  }

  const body = await req.json();
  const { category, discId } = body as Product;

  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      category,
      discId,

      updatedAt: new Date(),
    },
  });

  return NextResponse.json(product);
}
