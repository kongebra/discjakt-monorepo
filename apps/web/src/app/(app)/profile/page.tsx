import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export default async function Page() {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id,
    },
    select: {
      name: true,
      email: true,
      image: true,
      discs: true,
      bags: true,
    },
  });

  return (
    <div className=''>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
