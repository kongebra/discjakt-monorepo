import prisma from '@/lib/prisma';
import { DiscView } from './types';

export async function fetchLatestUpdatedDiscs() {
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
    distinct: ['discId'],
    orderBy: {
      updatedAt: 'desc',
    },
    take: 4,
  });

  const productIds = latestUpdatedProducts.map((product) => product.discId!);

  const latestDiscs = await prisma.disc.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      brand: true,
      products: {
        include: {
          prices: {
            where: {
              availability: 'InStock',
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      },
    },
  });

  const discs: DiscView[] = latestDiscs.map((disc) => {
    const { products, ...rest } = disc;

    const lowestPrice = products.reduce((lowestPrice, product) => {
      const productLowestPrice = product.prices
        .filter(
          (productPrice) =>
            // Filter out prices that are not in stock or have a price of 0
            productPrice.availability === 'InStock' && productPrice.price.toNumber() > 0,
        )
        .reduce((prev, productPrice) => {
          // Find the lowest price
          if (productPrice.price.toNumber() < prev) {
            return productPrice.price.toNumber();
          }

          return prev;
        }, Number.MAX_SAFE_INTEGER);

      if (productLowestPrice < lowestPrice) {
        return productLowestPrice;
      }

      return lowestPrice;
    }, Number.MAX_SAFE_INTEGER);

    return {
      ...rest,

      speed: disc.speed.toNumber(),
      glide: disc.glide.toNumber(),
      turn: disc.turn.toNumber(),
      fade: disc.fade.toNumber(),

      price: lowestPrice,
    } as DiscView;
  });

  return discs;
}
