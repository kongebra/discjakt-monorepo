"use client";

import React, { useState } from "react";
import DiscsTable, { DiscsTableItem } from "./DiscsTable";
import DiscsModal from "./DiscsModal";
import { Brand } from "database";
import { useBoolean } from "usehooks-ts";
import { useRouter } from "next/navigation";

type Props = {
  discs: DiscsTableItem[];
  brands: Brand[];
};

const DiscsTableWrapper: React.FC<Props> = ({ discs, brands }) => {
  const router = useRouter();

  const [selectedDisc, setSelectedDisc] = useState<DiscsTableItem | undefined>(
    undefined
  );

  const createModal = useBoolean();

  return (
    <>
      <DiscsTable
        discs={discs}
        onClick={setSelectedDisc}
        onClickCreate={createModal.setTrue}
      />

      <DiscsModal
        brands={brands}
        open={selectedDisc !== undefined}
        disc={selectedDisc}
        onClose={() => setSelectedDisc(undefined)}
        onSubmit={async (data) => {
          if (!selectedDisc) {
            return;
          }

          await fetch(`/api/discs/${selectedDisc.id}`, {
            method: "PUT",
            body: JSON.stringify({
              ...data,
              id: selectedDisc.id,
            }),
          });

          setSelectedDisc(undefined);

          router.refresh();
        }}
      />

      <DiscsModal
        brands={brands}
        open={createModal.value}
        onClose={createModal.setFalse}
        onSubmit={async (data) => {
          await fetch(`/api/discs`, {
            method: "POST",
            body: JSON.stringify(data),
          });

          createModal.setFalse();

          router.refresh();
        }}
      />
    </>
  );
};

export default DiscsTableWrapper;
