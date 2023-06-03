import { Session } from 'next-auth';
import Link from 'next/link';
import { FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';

type Props = {
  session: Session;
};

const ProfileSidenav: React.FC<Props> = ({ session }) => {
  const isAdmin = session?.user.role === 'Admin';

  return (
    <aside className='flex max-w-xs flex-col'>
      <ul className='menu bg-base-200 rounded-box min-h-[32rem] w-72 p-4'>
        <li className='menu-title'>
          <h1 className='text-2xl'>Min konto</h1>
        </li>
        <li>
          <Link href='/profile'>Min profil</Link>
        </li>
        <li>
          <Link href='/profile/bag'>Min bag</Link>
        </li>
        <li>
          <Link href='/profile/discs'>Mine disker</Link>
        </li>

        <li className='mt-auto'>
          <Link href='/api/auth/signout'>
            <FaSignOutAlt className='mr-1 h-5 w-5' />
            Logg ut
          </Link>
        </li>
        {isAdmin ? (
          <li>
            <Link href='/admin'>
              <FaTachometerAlt className='mr-1 h-5 w-5' />
              Dashboard
            </Link>
          </li>
        ) : null}
      </ul>
    </aside>
  );
};

export default ProfileSidenav;
