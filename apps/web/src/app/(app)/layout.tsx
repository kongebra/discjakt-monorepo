import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';
import Footer from './_components/Footer';
import Navbar from './_components/Navbar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar session={session}>
        <div className='flex-1'>{children}</div>
      </Navbar>

      <Footer />
    </div>
  );
}
