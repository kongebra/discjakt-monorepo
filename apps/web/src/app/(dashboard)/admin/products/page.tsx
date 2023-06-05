import prisma from '@/lib/prisma';

export default async function Page() {
  const products = await prisma.product.findMany();

  return <div>{products?.length}</div>;
}
