import Modal from "@/components/Modal";
import React from "react";
import DiscsForm from "./DiscsForm";
import { DiscsTableItem } from "./DiscsTable";
import { Brand } from "database";

type Props = {
  onClose: () => void;
  disc?: DiscsTableItem;
  brands: Brand[];
};

const DiscsModal: React.FC<Props> = ({ onClose, disc, brands }) => {
  return (
    <Modal title="Discs modal" open={disc !== undefined} onClose={onClose}>
      <DiscsForm
        brands={brands}
        defaultValues={disc}
        onSubmit={async (data) => {
          console.log({ data });
          if (!disc) {
            return;
          }

          await fetch(`/api/discs/${disc.id}`, {
            method: "PUT",
            body: JSON.stringify({
              ...data,
              id: disc.id,
            }),
          });

          onClose();
        }}
      />
    </Modal>
  );
};

export default DiscsModal;
