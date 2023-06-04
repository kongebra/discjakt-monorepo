'use client';

import Button from '@/components/Button';
import clsx from 'clsx';
import { Product, Store } from 'database';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useProductMutation } from '../hooks/use-product-mutation';

type Props = {
  product: Product & { store: Store };
};

const haystack = ['backpack', 'bag', 'bagpack', 'backpack', 'bagpak', 'bagpakke', 'sekk'];

const BagButton: React.FC<Props> = ({ product }) => {
  const { trigger, isMutating } = useProductMutation(product.id, {
    onSuccess() {
      router.refresh();
    },
  });

  const router = useRouter();

  const found = haystack.some((needle) => product.name.toLowerCase().includes(needle));

  return (
    <Button
      size='xs'
      color={found ? 'success' : 'warning'}
      className={clsx({ 'animate-pulse': found })}
      onClick={async () => {
        await trigger({
          category: 'Bag',
        });
      }}
      loading={isMutating}
      disabled={isMutating}
    >
      Bag
    </Button>
  );
};

export default BagButton;
