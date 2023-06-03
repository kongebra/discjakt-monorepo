import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import ProfileSidenav from './_components/ProfileSidenav';

type Props = React.PropsWithChildren<{}>;

export default async function ProfileLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect('/api/auth/signin?callbackUrl=/profile');
  }

  return (
    <div className='mx-auto flex h-full max-w-7xl gap-4 py-4 md:gap-6 md:py-6 lg:gap-8 lg:py-8'>
      <ProfileSidenav session={session} />

      <main className='flex-1'>{children}</main>
    </div>
  );
}
