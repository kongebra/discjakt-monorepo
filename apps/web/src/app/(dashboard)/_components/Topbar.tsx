'use client';

import { Menu } from '@headlessui/react';
import clsx from 'clsx';
import { Session } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaBars, FaBell, FaChevronDown, FaSearch } from 'react-icons/fa';

type Props = {
  session: Session;
};

const Topbar: React.FC<Props> = ({ session }) => {
  return (
    <div className='sticky top-0 z-40 flex h-16 flex-shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8'>
      <button type='button' className='-m-2.5 p-2.5 text-gray-700 lg:hidden'>
        <span className='sr-only'>Open sidebar</span>
        {/* TODO: Finn en tynnere bars icon */}
        <FaBars className='h-6 w-6' />
      </button>

      <div className='h-6 w-px bg-gray-900/10 lg:hidden' aria-hidden='true' />

      <div className='flex flex-1 gap-x-4 self-stretch lg:gap-x-6'>
        <form action='#' method='GET' id='search-form' className='relative flex flex-1'>
          <label htmlFor='search-field' className='sr-only'>
            Search
          </label>
          <FaSearch
            className='pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400'
            aria-hidden='true'
          />
          <input
            type='search'
            id='search-field'
            placeholder='Search...'
            name='search'
            className='block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 focus:outline-none focus:ring-0 sm:text-sm'
          />
        </form>

        <div className='flex items-center gap-x-4 lg:gap-x-6'>
          <div className='indicator'>
            <div className='indicator-item badge badge-primary'>3</div>
            <button type='button' className='-m-2.5 p-2.5 text-gray-400 hover:text-gray-500'>
              <span className='sr-only'>View notifications</span>
              <FaBell className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>

          <div className='hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10' aria-hidden='true' />

          <Menu as='div' className='relative'>
            <Menu.Button className='-m-1.5 flex items-center p-1.5'>
              <span className='sr-only'>Open user menu</span>

              {session?.user?.image ? (
                <Image
                  className='h-8 w-8 rounded-full bg-gray-50'
                  src={session.user.image}
                  alt={'Profile picture'}
                  width={32}
                  height={32}
                />
              ) : (
                <div></div>
              )}

              <span className='hidden lg:flex lg:items-center'>
                <span
                  className='ml-4 text-sm font-semibold leading-6 text-gray-900'
                  aria-hidden='true'
                >
                  {session?.user?.name ?? 'Unknown Username'}
                </span>
                <FaChevronDown className={'ml-2 h-5 w-5 text-gray-400'} aria-hidden='true' />
              </span>
            </Menu.Button>

            <Menu.Items
              as='div'
              className='absolute z-10 mt-2.5 w-32 scale-100 transform rounded-md bg-white py-2 opacity-100 shadow-lg ring-1 ring-gray-900/5'
            >
              <Menu.Item>
                {({ active }) => (
                  <Link
                    className={clsx(
                      'block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50',
                      { 'bg-gray-50': active },
                    )}
                    href='/account-settings'
                  >
                    Your account
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    className={clsx(
                      'block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50',
                      { 'bg-gray-50': active },
                    )}
                    href='/account-settings'
                  >
                    Sign out
                  </Link>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
