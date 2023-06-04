import prisma from '@/lib/prisma';
import { Prisma } from 'database';
import { NextResponse } from 'next/server';

export async function GET() {
  const today = new Date();
  const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

  const where: Prisma.ProductFindManyArgs['where'] = {
    lastmod: {
      lt: lastYear,
    },
  };

  const products = await prisma.product.deleteMany({
    where,
  });

  return NextResponse.json(products);
}
