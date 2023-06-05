import React from 'react';
import { DiscView } from '../types';
import DiscItem from './DiscItem';

type Props = {
  discs: DiscView[];
};

const DiscList: React.FC<Props> = ({ discs }) => {
  return (
    <>
      <h2>Latest updated discs</h2>

      <div className='grid grid-cols-4 gap-4'>
        {discs.map((disc) => (
          <DiscItem key={disc.id} disc={disc} />
        ))}
      </div>
    </>
  );
};

export default DiscList;
