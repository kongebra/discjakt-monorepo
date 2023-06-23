import prisma from '@/lib/prisma';
import { DiscsTableItem } from '../../discs/_components/DiscsTable';
import DiscImageTable from './_components/DiscImageTable';

export default async function Page() {
  const discs = await prisma.disc.findMany({
    where: {
      imageUrl: '',
    },
    include: {
      products: true,
      brand: true,

      _count: {
        select: {
          products: true,
          bags: true,
          users: true,
        },
      },
    },
  });

  const mappedDiscs: DiscsTableItem[] = discs.map(
    (disc) =>
      ({
        ...disc,
        speed: disc.speed.toNumber(),
        glide: disc.glide.toNumber(),
        turn: disc.turn.toNumber(),
        fade: disc.fade.toNumber(),
      } as DiscsTableItem),
  );

  return (
    <div>
      <DiscImageTable discs={mappedDiscs} />
    </div>
  );
}
