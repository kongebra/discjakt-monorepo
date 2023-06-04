'use client';

import Button from '@/components/Button';
import { Disc, Product, Store } from 'database';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useBoolean } from 'usehooks-ts';
import { useProductMutation } from '../hooks/use-product-mutation';
import SelectDiscModal from './SelectDiscModal';

type Props = {
  product: Product & { store: Store };
  discs: Disc[];
  onComplete?: () => void;
};

const SelectDiscButton: React.FC<Props> = ({ product, discs, onComplete }) => {
  const router = useRouter();

  const modal = useBoolean();

  const { trigger, isMutating } = useProductMutation(product.id, {
    onSuccess() {
      router.refresh();
      modal.setFalse();
    },
  });

  return (
    <>
      <Button type='button' size='xs' color='neutral' onClick={() => modal.setTrue()}>
        Velg disc
      </Button>

      <SelectDiscModal
        product={product}
        open={modal.value}
        onClose={modal.setFalse}
        discs={discs}
        onDiscSelected={async (disc) => {
          await trigger({
            discId: disc.id,
          });
        }}
        isLoading={isMutating}
      />
    </>
  );
};

export default SelectDiscButton;
