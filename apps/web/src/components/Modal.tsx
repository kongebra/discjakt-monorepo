import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
import React, { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';
import Button from './Button';

export type ModalProps = React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;

  title?: ReactNode;

  className?: string;
}>;

// TODO: Implement size
const Modal: React.FC<ModalProps> = ({ open, onClose, title, className, children }) => {
  return (
    <Dialog
      as='div'
      className={clsx('modal', { 'modal-open': open })}
      open={open}
      onClose={onClose}
    >
      <Dialog.Panel className={clsx('modal-box', className)}>
        <Button size='sm' shape='square' ghost className='absolute right-5 top-5' onClick={onClose}>
          <FaTimes />
        </Button>

        {title !== undefined ? (
          <Dialog.Title as='h3' className='text-lg font-bold'>
            {title}
          </Dialog.Title>
        ) : (
          <div className='h-7 w-full' />
        )}

        {children}
      </Dialog.Panel>
    </Dialog>
  );
};

export default Modal;
