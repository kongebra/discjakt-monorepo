import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

type Props = {
  params: {
    brandId: string;
  };
};

export async function GET(req: Request, { params: { brandId } }: Props) {
  if (!brandId) {
    return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 });
  }

  const id = parseInt(brandId);
  if (isNaN(id)) {
    return NextResponse.json({ error: 'Brand ID must be a number' }, { status: 400 });
  }

  const brand = await prisma.brand.findUnique({
    where: {
      id: id,
    },
    include: {
      _count: {
        select: {
          discs: true,
          plastics: true,
        },
      },
    },
  });

  return NextResponse.json(brand);
}
