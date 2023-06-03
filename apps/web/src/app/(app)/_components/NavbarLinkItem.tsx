'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type Props = React.PropsWithChildren<{
  href: string;
}>;

const NavbarLinkItem: React.FC<Props> = ({ href, children }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        className={clsx({
          active: isActive,
        })}
        href="/discs"
      >
        {children}
      </Link>
    </li>
  );
};

export default NavbarLinkItem;
