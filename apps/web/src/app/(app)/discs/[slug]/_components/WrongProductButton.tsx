'use client';

import Button from '@/components/Button';
import { Product } from 'database';
import { useRouter } from 'next/navigation';
import React from 'react';
import useSWRMutation from 'swr/mutation';

type Props = {
  product: Product;
};

async function decoupleDisc(url: string) {
  return await fetch(url, {
    method: 'PUT',
  }).then((res) => res.json());
}

const WrongProductButton: React.FC<Props> = ({ product }) => {
  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation(
    `/api/products/${product.id}/decouple`,
    decoupleDisc,
    {
      onSuccess() {
        router.refresh();
      },
    },
  );

  return (
    <Button
      className='join-item'
      color='error'
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await trigger();
      }}
      loading={isMutating}
    >
      Feil produkt
    </Button>
  );
};

export default WrongProductButton;
