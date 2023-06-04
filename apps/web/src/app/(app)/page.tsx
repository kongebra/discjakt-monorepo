import prisma from '@/lib/prisma';
import { DiscType } from 'database';

type DiscWithLowestPrice = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;

  speed: number;
  glide: number;
  turn: number;
  fade: number;

  brand: {
    id: number;
    name: string;
    slug: string;
    imageUrl: string | null;
  };

  type: DiscType;
  lowestPrice: number;
};

export default async function Home() {
  const latestUpdatedProducts = await prisma.product.findMany({
    where: {
      AND: [
        {
          deletedAt: null,
        },
        {
          discId: {
            not: null,
          },
        },
      ],
    },
    orderBy: {
      updatedAt: 'desc',
    },
    include: {
      disc: {
        include: {
          brand: true,
        },
      },
      prices: {
        where: {
          availability: 'InStock',
        },
        orderBy: {
          createdAt: 'desc',
        },
        distinct: ['productId'],
      },
    },
    take: 4,
  });

  const discsWithLowestPrice: DiscWithLowestPrice[] = latestUpdatedProducts.map((product) => {
    const lowestPrice = product.prices.reduce(
      (prev, current) => (current.price.toNumber() < prev ? current.price.toNumber() : prev),
      Number.MAX_VALUE,
    );

    const disc = product.disc!;

    return {
      id: disc.id,
      name: disc.name,
      slug: disc.slug,
      imageUrl: disc.imageUrl,

      speed: disc.speed.toNumber(),
      glide: disc.glide.toNumber(),
      turn: disc.turn.toNumber(),
      fade: disc.fade.toNumber(),

      type: disc.type,
      brand: {
        id: disc.brand.id,
        name: disc.brand.name,
        slug: disc.brand.slug,
        imageUrl: disc.brand.imageUrl,
      },

      lowestPrice,
    };
  });

  return (
    <main>
      <div className='mx-auto max-w-7xl'>
        <pre>{JSON.stringify(discsWithLowestPrice, null, 2)}</pre>
      </div>
    </main>
  );
}
