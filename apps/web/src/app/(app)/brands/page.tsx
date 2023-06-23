import Link from 'next/link';

export default async function Page() {
  const brands = await prisma.brand.findMany({
    include: {
      _count: {
        select: {
          discs: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='py-4'>
        <h1 className='mb-8 text-4xl font-bold'>Brands</h1>

        <div className='grid grid-cols-4 gap-4'>
          {brands.map((brand) => (
            <Link
              href={`/brands/${brand.slug}`}
              key={brand.id}
              className='rounded bg-white p-4 shadow transition-shadow hover:shadow-md hover:ring-2 hover:ring-gray-200'
            >
              <h3 className='mb-4 text-lg font-semibold'>{brand.name}</h3>
              <p>Discs: {brand._count.discs}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
