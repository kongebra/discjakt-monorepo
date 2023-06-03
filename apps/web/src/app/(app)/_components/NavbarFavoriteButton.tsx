import { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import { FaRegHeart } from 'react-icons/fa';

type Props = {
  session: Session | null;
};

const NavbarFavoriteButton: React.FC<Props> = ({ session }) => {
  return (
    <Link href={'/favorites'} className='btn btn-ghost btn-circle' title='Favoritter'>
      <FaRegHeart className='h-5 w-5' />
    </Link>
  );
};

export default NavbarFavoriteButton;
