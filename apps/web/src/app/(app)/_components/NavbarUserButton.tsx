import { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import { FaRegUser } from 'react-icons/fa';

type Props = {
  session: Session | null;
};

const NavbarUserButton: React.FC<Props> = ({ session }) => {
  return (
    <Link
      href={session ? '/profile' : '/api/auth/signin'}
      className='btn btn-ghost btn-circle'
      title={session ? 'Din profil' : 'Logg inn'}
    >
      <FaRegUser className='h-5 w-5' />
    </Link>
  );
};

export default NavbarUserButton;
