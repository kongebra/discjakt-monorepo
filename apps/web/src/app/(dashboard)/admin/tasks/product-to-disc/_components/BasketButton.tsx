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

const haystack = ['kurv', 'basket', 'target'];

const BasketButton: React.FC<Props> = ({ product }) => {
  const router = useRouter();

  const { trigger, isMutating } = useProductMutation(product.id, {
    onSuccess() {
      router.refresh();
    },
  });

  const found = haystack.some((needle) => product.name.toLowerCase().includes(needle));

  return (
    <Button
      size='xs'
      color={found ? 'success' : 'warning'}
      className={clsx({ 'animate-pulse': found })}
      onClick={async () => {
        await trigger({
          category: 'Basket',
        });
      }}
      loading={isMutating}
      disabled={isMutating}
    >
      Kurv
    </Button>
  );
};

export default BasketButton;
