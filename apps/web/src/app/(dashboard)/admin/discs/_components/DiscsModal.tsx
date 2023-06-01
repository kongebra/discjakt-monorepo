import Modal from "@/components/Modal";
import React from "react";
import DiscsForm, { DiscFormData } from "./DiscsForm";
import { DiscsTableItem } from "./DiscsTable";
import { Brand } from "database";

type Props = {
  onClose: () => void;
  open: boolean;
  disc?: DiscsTableItem;
  brands: Brand[];
  onSubmit: (data: DiscFormData) => void;
};

const DiscsModal: React.FC<Props> = ({
  onClose,
  open,
  disc,
  brands,
  onSubmit,
}) => {
  return (
    <Modal title="Discs modal" open={open} onClose={onClose}>
      <DiscsForm brands={brands} defaultValues={disc} onSubmit={onSubmit} />
    </Modal>
  );
};

export default DiscsModal;
