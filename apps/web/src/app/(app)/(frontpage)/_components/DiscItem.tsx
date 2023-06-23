import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { DiscView } from '../types';

type Props = {
  disc: DiscView;
};

// TODO: Make this look better
const DiscItem: React.FC<Props> = ({ disc }) => {
  return (
    <Link
      href={`/discs/${disc.slug}`}
      className='duration-400 flex flex-col items-center rounded bg-white p-4 shadow transition-shadow hover:shadow-lg'
    >
      <Image
        className='mask mask-circle mb-4 aspect-square h-auto max-w-full'
        src={disc.imageUrl}
        alt={disc.name}
        width={200}
        height={200}
      />

      <div className='mb-4 flex items-center justify-center gap-2'>
        <span
          title='Speed'
          className='flex h-10 w-10 items-center justify-center rounded-full bg-green-200 font-bold text-green-900'
        >
          {disc.speed}
        </span>
        <span
          title='Glide'
          className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-200 font-bold text-orange-900'
        >
          {disc.glide}
        </span>
        <span
          title='Turn'
          className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-200 font-bold text-blue-900'
        >
          {disc.turn}
        </span>
        <span
          title='Fade'
          className='flex h-10 w-10 items-center justify-center rounded-full bg-yellow-200 font-bold text-yellow-900'
        >
          {disc.fade}
        </span>
      </div>

      <h3 className='text-xl font-semibold'>{disc.name}</h3>
      <h4 className='mb-4 text-sm'>{disc.brand.name}</h4>

      <p className='font-semibold'>{disc.price.toLocaleString()} kr</p>
    </Link>
  );
};

export default DiscItem;
