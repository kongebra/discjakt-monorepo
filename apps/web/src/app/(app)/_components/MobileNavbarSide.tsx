'use client';

import Link from 'next/link';
import React, { useRef } from 'react';
import { FaTimes } from 'react-icons/fa';

type Props = {
  navLinks: { href: string; label: React.ReactNode }[];
};

const MobileNavbarSide: React.FC<Props> = ({ navLinks }) => {
  const ref = useRef<HTMLLabelElement>(null);

  return (
    <div className='drawer-side z-50'>
      <label htmlFor='navbar-drawer' className='drawer-overlay'></label>

      <div className='bg-base-200 flex h-full w-full flex-col p-4'>
        <div className='flex items-center justify-between'>
          <span className='ml-4 text-2xl font-semibold'>DiscJakt</span>

          <label ref={ref} htmlFor='navbar-drawer' className='btn btn-square btn-ghost'>
            <FaTimes className='h-5 w-5' />
          </label>
        </div>

        <ul className='menu menu-lg'>
          {navLinks.map((link) => (
            <li key={link.href} className='text-xl'>
              <Link
                href={link.href}
                onClick={() => {
                  ref.current?.click();
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MobileNavbarSide;
