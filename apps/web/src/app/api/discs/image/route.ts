import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const discs = await prisma.disc.findMany({
    where: {
      imageUrl: '',
    },
    include: {
      products: true,
    },
  });

  const batchSize = 10;
  const batches = discs.reduce((acc, disc, i) => {
    const batchIndex = Math.floor(i / batchSize);
    acc[batchIndex] = acc[batchIndex] || [];
    acc[batchIndex].push(disc);
    return acc;
  }, [] as any[][]);

  for (const batch of batches) {
    await Promise.all(
      batch.map(async (disc) => {
        const imageUrl = disc.products.length > 0 ? disc.products[0].imageUrl : '';

        await prisma.disc.update({
          where: {
            id: disc.id,
          },
          data: {
            imageUrl,
          },
        });
      }),
    );
  }

  return NextResponse.json({ done: true });
}
