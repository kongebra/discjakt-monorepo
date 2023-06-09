import prisma from '@/lib/prisma';
import StoresTableWrapper from './_components/StoresTableWrapper';

export default async function Page() {
  const stores = await prisma.store.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div>
      <StoresTableWrapper stores={stores} />
    </div>
  );
}
