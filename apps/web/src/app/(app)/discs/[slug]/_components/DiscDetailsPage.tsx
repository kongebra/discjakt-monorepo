'use client';

import { getTimeSinceDate } from '@/utils/date';
import clsx from 'clsx';
import type { Brand, Disc, Plastic, Product, ProductPrice, Store } from 'database';
import Image from 'next/image';
import Link from 'next/link';
import WrongProductButton from './WrongProductButton';

type Props = {
  disc: Disc & {
    brand: Brand;
    plastics: {
      plastic: Plastic;
    }[];
    products: (Product & {
      store: Store;
      prices: (ProductPrice & {
        price: number;
      })[];
    })[];
    // bags: Bag[];
    // users: User[];

    speed: number;
    glide: number;
    turn: number;
    fade: number;
  };

  isAdmin?: boolean;
};

const DiscDetailsPage: React.FC<Props> = ({ disc, isAdmin }) => {
  const filterProducts = (
    product: Product & { store: Store; prices: (ProductPrice & { price: number })[] },
  ): boolean => {
    // only show products that are in stock
    if (product.prices.length === 0) {
      return false;
    }

    const price = product.prices[product.prices.length - 1];

    if (price.availability === 'OutOfStock' || price.price === 0) {
      return false;
    }

    return true;
  };

  const sortProducts = (
    a: Product & { store: Store; prices: (ProductPrice & { price: number })[] },
    b: Product & { store: Store; prices: (ProductPrice & { price: number })[] },
  ): number => {
    // sort by price, and if out of stock, put it last
    const priceA = a.prices.length > 0 ? a.prices[a.prices.length - 1].price : -1;
    const priceB = b.prices.length > 0 ? b.prices[b.prices.length - 1].price : -1;

    if (priceA === priceB) {
      return 0;
    }

    if (priceA === -1) {
      return 1;
    }

    if (priceB === -1) {
      return -1;
    }

    return priceA - priceB;
  };

  return (
    <div>
      <section className='py-4'>
        <div className='mx-auto max-w-7xl'>
          <div className='py-2'>breadcrumbs?</div>

          <div className='flex gap-8'>
            <Image
              className='h-auto max-w-full'
              src={disc.imageUrl}
              alt={disc.name}
              width={200}
              height={200}
            />

            <div className='flex flex-1 flex-col gap-4'>
              <h1 className='text-4xl font-bold'>{disc.name}</h1>

              <p>Description?</p>
            </div>

            <div className='max-w-xs flex-1'>pris historikk?</div>
          </div>
        </div>
      </section>

      <section className='bg-gray-200 py-4'>
        <div className='mx-auto max-w-7xl'>
          <div className='flex items-center gap-4'>
            <h2 className='mb-4 text-2xl font-semibold'>Laveste priser</h2>

            <p>TODO: Filter på plastikk</p>
            <p>TODO: Søkefilter her</p>
            <p>TODO: En del produkter som er outOfStock, dette må fikses</p>
          </div>

          <div className='flex flex-col gap-2'>
            {[...disc.products]
              .filter(filterProducts)
              .sort(sortProducts)
              .map((product) => {
                const price =
                  product.prices.length > 0 ? product.prices[product.prices.length - 1] : null;

                return (
                  <Link
                    key={product.id}
                    href={product.loc}
                    target='_blank'
                    className='duration-400 flex flex-1 items-center gap-4 rounded border bg-white p-4 transition-shadow hover:shadow'
                  >
                    <div className='max-w-[12rem] flex-1'>{product.store.name}</div>
                    <div className='flex flex-1 items-center gap-4'>
                      <Image
                        className='h-auto max-w-full '
                        src={product.imageUrl}
                        alt={product.name}
                        width={48}
                        height={48}
                      />
                      <span>{product.name}</span>
                    </div>
                    <div className='flex items-center gap-4'>
                      <div className='flex flex-col items-end justify-between'>
                        <span className='text-lg font-semibold'>
                          {(price?.price || -1).toLocaleString()} kr
                        </span>

                        <span>
                          {!!price ? (
                            <span className='text-sm text-gray-700'>
                              {getTimeSinceDate(product.updatedAt)}
                            </span>
                          ) : null}
                        </span>
                      </div>

                      <div
                        className={clsx({
                          join: isAdmin,
                        })}
                      >
                        <Link
                          className={clsx('btn btn-primary', {
                            'join-item': isAdmin,
                          })}
                          href={product.loc}
                          target='_blank'
                        >
                          Vis i butikk
                        </Link>
                        {isAdmin ? <WrongProductButton product={product as Product} /> : null}
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscDetailsPage;
