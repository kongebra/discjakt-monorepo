import prisma from '@/lib/prisma';
import { Disc } from 'database';
import CreateNewDiscButton from './_components/CreateNewDiscButton';
import DiscSuggestorTable from './_components/DiscSuggestorTable';
import SuperSuggestor from './_components/SuperSuggestor';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const totalCount = await prisma.product.count({
    where: {
      AND: [
        { discId: null },
        {
          category: 'Unknown',
        },
        {
          deletedAt: null,
        },
        {
          prices: {
            every: {
              price: {
                gt: 0,
              },
            },
          },
        },
      ],
    },
  });
  const products = await prisma.product.findMany({
    where: {
      AND: [
        { discId: null },
        {
          category: 'Unknown',
        },
        {
          deletedAt: null,
        },
        {
          prices: {
            every: {
              price: {
                gt: 0,
              },
            },
          },
        },
      ],
    },
    include: {
      store: true,
      prices: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
    // orderBy: {
    //   updatedAt: 'asc',
    // },
    take: 100,
  });
  const discs = await prisma.disc.findMany();
  const mappedDiscs = discs.map((disc) => {
    return {
      ...disc,
      speed: disc.speed.toNumber(),
      glide: disc.glide.toNumber(),
      turn: disc.turn.toNumber(),
      fade: disc.fade.toNumber(),
    } as Disc & {
      speed: number;
      glide: number;
      turn: number;
      fade: number;
    };
  });

  const mappedProducts = products.map((product) => {
    return {
      ...product,
      prices: product.prices.map((price) => {
        return {
          ...price,
          price: price.price.toNumber(),
        };
      }),
    };
  });

  // TODO: Gjør ekstra sjekk på "Ra" & "FL" & "IT", "Ringer"
  // TODO: Sockibomb Slammer -> Slammer
  // TODO: Sjekk Armadillo (sekk?)
  // TODO: Sjekk alle produkter med "start" i navnet
  return (
    <div>
      <h1 className='mb-4 text-2xl font-semibold'>{totalCount} uncatigorised products</h1>

      <div className='flex gap-4'>
        <SuperSuggestor products={mappedProducts} discs={mappedDiscs} />
        <CreateNewDiscButton />
      </div>

      <DiscSuggestorTable products={mappedProducts} discs={mappedDiscs} totalCount={totalCount} />
      {/* <ProductsList totalCount={totalCount} products={products} discs={mappedDiscs} /> */}

      <SuperSuggestor products={mappedProducts} discs={mappedDiscs} />
    </div>
  );
}
