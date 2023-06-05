import Modal from '@/components/Modal';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDiscMutation } from '../hooks/use-disc-mutation';
import { DiscsTableItem } from './DiscsTable';

type Props = {
  disc?: DiscsTableItem;
  open: boolean;
  onClose: () => void;
};

const DiscImageModal: React.FC<Props> = ({ disc, open, onClose }) => {
  const router = useRouter();
  const { trigger, isMutating } = useDiscMutation(disc?.id, {
    onSuccess: () => {
      router.refresh();
      onClose();
    },
  });

  if (!disc) {
    return null;
  }

  return (
    <Modal
      title={`Edit image for ${disc?.name}`}
      open={open}
      onClose={onClose}
      className='h-full w-full max-w-7xl'
    >
      <div className='grid grid-cols-4 gap-4 py-4'>
        {disc.products.map((product) => (
          <button
            className={clsx('ring hover:ring-indigo-700', {
              'ring-success': disc.imageUrl === product.imageUrl,
            })}
            key={product.id}
            onClick={async () => {
              await trigger({
                ...disc,
                imageUrl: product.imageUrl,
              });
            }}
            disabled={isMutating}
          >
            <Image
              className={clsx('h-auto max-w-full', {
                'animate-pulse': isMutating,
              })}
              src={product.imageUrl}
              alt={product.name}
              width={300}
              height={300}
              unoptimized
            />
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default DiscImageModal;
