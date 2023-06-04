import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const brands = await prisma.brand.findMany({
    include: {
      _count: {
        select: {
          discs: true,
          plastics: true,
        },
      },
    },
  });

  return NextResponse.json(brands);
}

export async function POST(req: Request) {
  try {
    const { name, slug, imageUrl } = await req.json();

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        imageUrl,
      },
    });

    return NextResponse.json(brand, { status: 201 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
