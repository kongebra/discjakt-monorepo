import { getTimeSinceDate } from '@/utils/date';
import { Disc, Product, Store } from 'database';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import DiscSuggestor from './DiscSuggestor';

type Props = {
  totalCount: number;
  products: (Product & { store: Store })[];
  discs: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[];
};

// TODO: Lag heller en tabell, alltid "NOT A DISC" og "SELECT DISC" knapper
const ProductsList: React.FC<Props> = ({ products, discs }) => {
  return (
    <div className='flex flex-col'>
      <ul role='list' className='divide-y'>
        {products.map((product) => (
          <li key={product.id} className='px-4 py-1 sm:px-6 lg:px-8'>
            <div className='flex items-center gap-x-3'>
              {product.imageUrl === 'none' ? (
                <span className='flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gray-800'>
                  <FaTimes className='h-10 w-10 animate-pulse text-red-500' />
                </span>
              ) : (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={48}
                  height={48}
                  className='h-12 w-12 flex-none rounded-full bg-gray-800'
                  unoptimized
                />
              )}

              <div className='flex-1'>
                <h3 className='overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold leading-6 text-gray-900'>
                  <Link
                    className='text-indigo-600 hover:text-indigo-700'
                    href={product.loc}
                    target='_blank'
                  >
                    {product.name}
                  </Link>
                </h3>

                <p className='mt-3 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500'>
                  Scraped from{' '}
                  <Link
                    className='mr-1 font-semibold text-indigo-600 hover:text-indigo-700'
                    href={product.store.url}
                    target='_blank'
                  >
                    {product.store.name}
                  </Link>
                  <time dateTime={product.updatedAt.toString()} className='text-gray-500'>
                    {getTimeSinceDate(product.updatedAt)}
                  </time>
                  {' ago'}
                </p>
              </div>

              <DiscSuggestor discs={discs} product={product} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;
