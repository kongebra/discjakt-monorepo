import prisma from '@/lib/prisma';
import { DiscView } from './types';

export async function fetchLatestUpdatedDiscs() {
  const products = await prisma.product.findMany({
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

  const discs: DiscView[] = products.map((product) => {
    const lowestPrice = product.prices.reduce((prev, current) => {
      const price = current.price.toNumber();
      return price < prev ? price : prev;
    }, Number.MAX_VALUE);
    const disc = product.disc!;

    return {
      ...disc,

      speed: disc.speed.toNumber(),
      glide: disc.glide.toNumber(),
      turn: disc.turn.toNumber(),
      fade: disc.fade.toNumber(),

      price: lowestPrice,
    } as DiscView;
  });

  // const latestUpdatedDiscs: DiscWithLowestPrice[] = products.map((product) => {
  //   const lowestPrice = product.prices.reduce(
  //     (prev, current) => (current.price.toNumber() < prev ? current.price.toNumber() : prev),
  //     Number.MAX_VALUE,
  //   );

  //   const disc = product.disc!;

  //   return {
  //     id: disc.id,
  //     name: disc.name,
  //     slug: disc.slug,
  //     imageUrl: disc.imageUrl,

  //     speed: disc.speed.toNumber(),
  //     glide: disc.glide.toNumber(),
  //     turn: disc.turn.toNumber(),
  //     fade: disc.fade.toNumber(),

  //     type: disc.type,
  //     brand: {
  //       id: disc.brand.id,
  //       name: disc.brand.name,
  //       slug: disc.brand.slug,
  //       imageUrl: disc.brand.imageUrl,
  //     },

  //     lowestPrice,
  //   };
  // });

  return discs;
}
