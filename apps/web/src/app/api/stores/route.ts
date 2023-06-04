import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

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
