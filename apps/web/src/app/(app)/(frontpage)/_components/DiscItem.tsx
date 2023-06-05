import Button from '@/components/Button';
import Image from 'next/image';
import React from 'react';
import { DiscView } from '../types';

type Props = {
  disc: DiscView;
};

// TODO: Make this look better
const DiscItem: React.FC<Props> = ({ disc }) => {
  return (
    <div className='card bg-base-100 shadow-xl'>
      <figure>
        <Image src={disc.imageUrl} alt={disc.name} width={300} height={300} priority />
      </figure>

      <div className='card-body'>
        <h2 className='card-title'>{disc.name}</h2>
        <h3 className='card-compact'>Laveste pris: {disc.price.toLocaleString()} kr</h3>

        <div className='card-actions justify-end'>
          <Button color='primary'>Buy now</Button>
        </div>
      </div>
    </div>
  );
};

export default DiscItem;
