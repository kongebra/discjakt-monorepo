import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import DiscDetailsPage from './_components/DiscDetailsPage';

type Params = {
  slug: string;
};

type Props = {
  params: Params;
};

export default async function Page({ params: { slug } }: Props) {
  const session = await getServerSession(authOptions);
  const disc = await prisma.disc.findUnique({
    where: {
      slug,
    },
    include: {
      brand: true,
      products: {
        include: {
          store: true,
          prices: {
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      },
      plastics: {
        include: {
          plastic: true,
        },
      },
      //   bags: true,
      //   users: true,
    },
  });

  if (!disc) {
    notFound();
  }

  const discDto = {
    ...disc,

    speed: disc.speed.toNumber(),
    glide: disc.glide.toNumber(),
    turn: disc.turn.toNumber(),
    fade: disc.fade.toNumber(),

    products: disc.products.map((product) => ({
      ...product,

      prices: product.prices.map((price) => ({
        ...price,
        price: price.price.toNumber(),
      })),
    })),
  };

  return (
    <div>
      <DiscDetailsPage isAdmin={session?.user.role === 'Admin'} disc={discDto as any} />
    </div>
  );
}
