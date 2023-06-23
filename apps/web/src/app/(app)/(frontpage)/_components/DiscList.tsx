import React from 'react';
import { DiscView } from '../types';
import DiscItem from './DiscItem';

type Props = {
  discs: DiscView[];
};

const DiscList: React.FC<Props> = ({ discs }) => {
  return (
    <section className='bg-gray-200 py-8'>
      <div className='mx-auto max-w-7xl'>
        <h2 className='mb-8 text-center text-4xl font-bold'>Sist oppdaterte disker</h2>

        <div className='grid grid-cols-4 gap-8'>
          {discs.map((disc) => (
            <DiscItem key={disc.id} disc={disc} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscList;
