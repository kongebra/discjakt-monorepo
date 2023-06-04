import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import Sidenav from './_components/Sidenav';
import Topbar from './_components/Topbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'Admin') {
    return redirect('/');
  }

  return (
    <div>
      <Sidenav />
      <div className='lg:pl-72'>
        <Topbar session={session} />

        <main className='py-10'>
          <div className='px-4 sm:px-6 lg:px-8'>{children}</div>
        </main>
      </div>
    </div>
  );
}
