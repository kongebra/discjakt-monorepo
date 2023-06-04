'use client';

import Modal from '@/components/Modal';
import { Brand, Product, Store } from 'database';
import { useRouter } from 'next/navigation';
import React from 'react';
import DiscsForm from '../../../discs/_components/DiscsForm';
import { useBrands } from '../hooks/use-brands';
import { useDiscMutation } from '../hooks/use-disc-mutation';

type Props = {
  product?: Product & { store: Store };
  open: boolean;
  onClose: () => void;
};

const CreateNewDiscModal: React.FC<Props> = ({ product, open, onClose }) => {
  const router = useRouter();

  const { data: brands } = useBrands();

  const { trigger, isMutating } = useDiscMutation({
    onSuccess() {
      router.refresh();
      onClose();
    },
  });

  return (
    <Modal title='Lag ny disc' open={open} onClose={onClose}>
      <DiscsForm
        defaultValues={{
          imageUrl: product?.imageUrl,
        }}
        onSubmit={async (data) => {
          await trigger({
            name: data.name,
            slug: data.slug,
            speed: data.speed as any,
            glide: data.glide as any,
            turn: data.turn as any,
            fade: data.fade as any,
            type: data.type,
            brandId: data.brandId,
            imageUrl: data.imageUrl,
          });
        }}
        brands={brands as Brand[]}
        isLoading={isMutating}
      />
    </Modal>
  );
};

export default CreateNewDiscModal;
