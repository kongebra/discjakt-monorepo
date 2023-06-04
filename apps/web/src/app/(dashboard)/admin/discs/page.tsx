import prisma from '@/lib/prisma';
import { DiscsTableItem } from './_components/DiscsTable';
import DiscsTableWrapper from './_components/DiscsTableWrapper';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const brands = await prisma.brand.findMany();
  const discs = await prisma.disc.findMany({
    include: {
      _count: {
        select: {
          products: true,
          bags: true,
          users: true,
        },
      },
      brand: true,
    },
  });

  const mappedDiscs = discs.map((disc) => ({
    ...disc,

    // Warning: Only plain objects can be passed to Client Components from Server Components. Decimal objects are not supported.
    speed: Number(disc.speed),
    glide: Number(disc.glide),
    turn: Number(disc.turn),
    fade: Number(disc.fade),
  })) as DiscsTableItem[];

  return (
    <div>
      <DiscsTableWrapper discs={mappedDiscs} brands={brands} />
    </div>
  );
}
