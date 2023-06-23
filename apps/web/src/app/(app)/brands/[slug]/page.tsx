import { notFound } from 'next/navigation';

type Params = {
  slug: string;
};

type Props = {
  params: Params;
};

export default async function Page({ params: { slug } }: Props) {
  const brand = await prisma.brand.findUnique({
    where: {
      slug,
    },
    include: {
      discs: true,
    },
  });

  if (!brand) {
    notFound();
  }

  return (
    <div>
      <div className='mx-auto max-w-7xl'>
        <h1 className='mb-4 text-4xl font-bold'>{brand.name}</h1>
      </div>
    </div>
  );
}
