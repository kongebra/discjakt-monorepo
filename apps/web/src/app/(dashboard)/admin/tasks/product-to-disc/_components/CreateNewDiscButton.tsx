'use client';

import Button from '@/components/Button';
import { Product, Store } from 'database';
import React from 'react';
import { useBoolean } from 'usehooks-ts';
import CreateNewDiscModal from './CreateNewDiscModal';

type Props = {
  product?: Product & { store: Store };
};

const CreateNewDiscButton: React.FC<Props> = ({ product }) => {
  const modal = useBoolean();

  return (
    <>
      <Button type='button' size='xs' color='success' onClick={() => modal.setTrue()}>
        Lag ny disc
      </Button>

      <CreateNewDiscModal product={product} open={modal.value} onClose={modal.setFalse} />
    </>
  );
};

export default CreateNewDiscButton;
