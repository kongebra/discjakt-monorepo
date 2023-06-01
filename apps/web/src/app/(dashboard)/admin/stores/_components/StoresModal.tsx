import Modal from "@/components/Modal";
import React from "react";
import StoresForm from "./StoresForm";
import { StoresTableItem } from "./StoresTable";

type Props = {
  onClose: () => void;
  store?: StoresTableItem;
};

const StoresModal: React.FC<Props> = ({ onClose, store }) => {
  return (
    <Modal title="Stores modal" open={store !== undefined} onClose={onClose}>
      <StoresForm
        defaultValues={store}
        onSubmit={async (data) => {
          if (!store) {
            return;
          }

          await fetch(`/api/stores/${store?.id}`, {
            method: "PUT",
            body: JSON.stringify({
              ...data,
              id: store.id,
            }),
          });

          onClose();
        }}
      />
    </Modal>
  );
};

export default StoresModal;
