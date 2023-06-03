import { Session } from 'next-auth';
import Link from 'next/link';
import { FaBars } from 'react-icons/fa';
import MobileNavbarSide from './MobileNavbarSide';
import NavbarFavoriteButton from './NavbarFavoriteButton';
import NavbarLinkItem from './NavbarLinkItem';
import NavbarUserButton from './NavbarUserButton';

type Props = React.PropsWithChildren<{
  session: Session | null;
}>;

const navLinks: { href: string; label: React.ReactNode }[] = [
  {
    href: '/discs',
    label: 'Discs',
  },
  {
    href: '/brands',
    label: 'Brands',
  },
  {
    href: '/pro-players',
    label: 'Pro Players',
  },
  {
    href: '/stores',
    label: 'Stores',
  },
];

const Navbar: React.FC<Props> = ({ session, children }) => {
  return (
    <div className='drawer flex-1'>
      <input id='navbar-drawer' type='checkbox' className='drawer-toggle' />

      <div className='drawer-content flex flex-col'>
        {/* MainNavbar */}
        <nav className='navbar bg-accent text-accent-content'>
          <div className='mx-auto flex flex-1 items-center lg:max-w-7xl'>
            <div className='flex-none lg:hidden'>
              <label htmlFor='navbar-drawer' className='btn btn-square btn-ghost'>
                <FaBars className='h-5 w-5' />
              </label>
            </div>

            <div className='flex flex-1 items-center gap-4'>
              <Link href='/' className='btn btn-ghost text-xl normal-case'>
                DiscJakt
              </Link>

              <div className='hidden lg:flex'>
                <ul className='menu menu-horizontal gap-x-2'>
                  {navLinks.map((link) => (
                    <NavbarLinkItem key={link.href} href={link.href}>
                      {link.label}
                    </NavbarLinkItem>
                  ))}
                </ul>
              </div>
            </div>

            <div className='flex flex-none items-center gap-x-2'>
              <NavbarUserButton session={session} />
              <NavbarFavoriteButton session={session} />
            </div>
          </div>
        </nav>

        {children}
      </div>

      <MobileNavbarSide navLinks={navLinks} />
    </div>
  );
};

export default Navbar;
