import { NextResponse } from 'next/server';

type Props = {
  params: {
    productId: string;
  };
};

export async function PUT(request: Request, { params: { productId } }: Props) {
  const id = parseInt(productId);

  if (!id) {
    return NextResponse.json('404', { status: 404 });
  }

  const result = await prisma.product.update({
    where: {
      id,
    },
    data: {
      discId: null,
    },
  });

  return NextResponse.json(result);
}
