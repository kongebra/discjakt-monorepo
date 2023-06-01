import React, { Fragment, ReactNode } from "react";
import { Dialog, Transition, DialogProps } from "@headlessui/react";
import clsx from "clsx";
import { FaTimes } from "react-icons/fa";
import Button from "./Button";

export type ModalProps = React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;

  title?: ReactNode;
}>;

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  return (
    <Dialog
      as="div"
      className={clsx("modal", { "modal-open": open })}
      open={open}
      onClose={onClose}
    >
      <Dialog.Panel className="modal-box">
        <Button
          size="sm"
          shape="square"
          color="ghost"
          className="absolute right-5 top-5"
          onClick={onClose}
        >
          <FaTimes />
        </Button>

        {title !== undefined ? (
          <Dialog.Title as="h3" className="font-bold text-lg">
            {title}
          </Dialog.Title>
        ) : (
          <div className="h-7 w-full" />
        )}

        {children}
      </Dialog.Panel>
    </Dialog>
  );
};

export default Modal;
