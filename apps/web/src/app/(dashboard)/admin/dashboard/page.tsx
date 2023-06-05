import prisma from '@/lib/prisma';
import { getTimeSinceDate } from '@/utils/date';
import Image from 'next/image';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';

export default async function Page() {
  const brands = await prisma.brand.findMany();
  const stores = await prisma.store.findMany();
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  const discs = await prisma.disc.findMany();

  const unknownProducts = products.filter((product) => product.category === 'Unknown');

  return (
    <div>
      <div className='stats bg-base-200 mb-8 w-full shadow'>
        <div className='stat'>
          <div className='stat-title'>Brands Count</div>
          <div className='stat-value'>{brands.length}</div>
          {/* <div className="stat-desc">All brands</div> */}
        </div>

        <div className='stat'>
          <div className='stat-title'>Store Count</div>
          <div className='stat-value'>{stores.length}</div>
          {/* <div className="stat-desc">All stores</div> */}
        </div>

        <div className='stat'>
          <div className='stat-title'>Products Count</div>
          <div className='stat-value'>{products.length}</div>
          {/* <div className="stat-desc">All products</div> */}
        </div>

        <div className='stat'>
          <div className='stat-title'>Unknown Products</div>
          <div className='stat-value'>{unknownProducts.length}</div>
          {/* <div className="stat-desc">With unknown category</div> */}
        </div>

        <div className='stat'>
          <div className='stat-title'>Discs Count</div>
          <div className='stat-value'>{discs.length}</div>
          {/* <div className="stat-desc">All discs</div> */}
        </div>
      </div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-3'>
        <div className='bg-base-200 rounded-lg shadow'>
          <header className='flex items-center justify-between border-b border-gray-400 px-4 py-4 sm:px-6 sm:py-6 lg:px-8'>
            <h2 className='text-base font-semibold leading-6 text-gray-900'>
              Latest updated products
            </h2>

            <Link href='#' className='text-sm font-semibold leading-6 text-indigo-600'>
              View all
            </Link>
          </header>

          <ul role='list' className='divide-x-1'>
            {products.slice(0, 8).map((product) => (
              <li key={product.id} className='px-4 py-4 sm:px-6 lg:px-8'>
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
                    <h3 className='truncate text-sm font-semibold leading-6 text-gray-900'>
                      <Link
                        className='text-indigo-600 hover:text-indigo-700'
                        href={product.loc}
                        target='_blank'
                        rel='noopener'
                      >
                        {product.name.length > 32
                          ? product.name.slice(0, 32) + '...'
                          : product.name}
                      </Link>
                    </h3>

                    <p className='mt-3 truncate text-sm text-gray-500'>
                      Scraped from{' '}
                      <span className='text-gray-700'>
                        {stores.find((store) => store.id === product.storeId)?.name}
                      </span>
                    </p>
                  </div>

                  <time
                    dateTime={product.updatedAt.toString()}
                    className='flex-none text-xs text-gray-500'
                  >
                    {getTimeSinceDate(product.updatedAt)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
