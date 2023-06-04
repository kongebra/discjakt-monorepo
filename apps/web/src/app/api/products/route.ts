import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('storeId');

  if (!id) {
    const products = await prisma.product.findMany({});

    return NextResponse.json(products);
  }

  const storeId = Number(id);

  if (isNaN(storeId) || storeId < 1) {
    return NextResponse.json({ error: 'storeId must be a number' }, { status: 400 });
  }

  const data = await prisma.product.findMany({ where: { storeId } });

  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('storeId');

  if (!id) {
    return NextResponse.json({ error: 'Missing storeId' }, { status: 400 });
  }

  const storeId = Number(id);

  if (isNaN(storeId) || storeId < 1) {
    return NextResponse.json({ error: 'storeId must be a number' }, { status: 400 });
  }

  const resp = await prisma.product.deleteMany({
    where: {
      storeId,
    },
  });

  return NextResponse.json(resp);
}
