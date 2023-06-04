import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Props = {
  params: {
    storeId: string;
  };
};

export async function GET(req: Request, { params: { storeId } }: Props) {
  if (!storeId) {
    return NextResponse.json({ error: 'Missing storeId' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? 1);
  const limit = Number(searchParams.get('limit') ?? 10);

  // Make sure page and limit are positive integers
  if (page < 1 || limit < 1 || limit > 100) {
    return NextResponse.json({ error: 'Invalid page or limit' }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: {
      AND: [
        {
          storeId: Number(storeId),
        },
        {
          deletedAt: null,
        },
      ],
    },
    select: {
      id: true,
      loc: true,
      lastmod: true,
      name: true,
      description: true,
      imageUrl: true,
      category: true,
      storeId: true,
      discId: true,

      prices: {
        select: {
          price: true,
          currency: true,
          availability: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
    take: limit,
    skip: (page - 1) * limit,
  });

  // You might also want to return total products count for front-end pagination UI
  const totalProducts = await prisma.product.count({
    where: {
      AND: [
        {
          storeId: Number(storeId),
        },
        {
          deletedAt: null,
        },
      ],
    },
  });

  const canNext = page * limit < totalProducts;
  const canPrev = page > 1;

  const baseUrl = req.headers.get('host') ?? 'localhost:3000';
  const baseUri = `${baseUrl}/api/stores/${storeId}/products`;

  const first = `${baseUri}?page=1&limit=${limit}`;
  const previous = canPrev ? `${baseUri}?page=${page - 1}&limit=${limit}` : null;
  const next = canNext ? `${baseUri}?page=${page + 1}&limit=${limit}` : null;
  const last = `${baseUri}?page=${Math.ceil(totalProducts / limit)}&limit=${limit}`;

  return NextResponse.json({
    data: products,
    meta: {
      totalItems: totalProducts,
      itemsPerPage: limit,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
    },
    links: {
      first,
      previous,
      next,
      last,
    },
  });
}
