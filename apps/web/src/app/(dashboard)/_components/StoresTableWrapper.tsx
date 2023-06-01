"use client";

import React, { useState } from "react";
import StoresTable, { StoresTableItem } from "./StoresTable";
import StoresModal from "./StoresModal";

type Props = {
  stores: StoresTableItem[];
};

const StoresTableWrapper: React.FC<Props> = ({ stores }) => {
  const [selectedStore, setSelectedStore] = useState<
    StoresTableItem | undefined
  >(undefined);

  return (
    <>
      <StoresTable stores={stores} onClick={setSelectedStore} />

      <StoresModal
        store={selectedStore}
        onClose={() => setSelectedStore(undefined)}
      />
    </>
  );
};

export default StoresTableWrapper;
