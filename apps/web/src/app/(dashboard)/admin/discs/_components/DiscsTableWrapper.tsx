"use client";

import React, { useState } from "react";
import DiscsTable, { DiscsTableItem } from "./DiscsTable";
import DiscsModal from "./DiscsModal";
import { Brand } from "database";

type Props = {
  discs: DiscsTableItem[];
  brands: Brand[];
};

const DiscsTableWrapper: React.FC<Props> = ({ discs, brands }) => {
  const [selectedDisc, setSelectedDisc] = useState<DiscsTableItem | undefined>(
    undefined
  );

  return (
    <>
      <DiscsTable discs={discs} onClick={setSelectedDisc} />

      <DiscsModal
        brands={brands}
        disc={selectedDisc}
        onClose={() => setSelectedDisc(undefined)}
      />
    </>
  );
};

export default DiscsTableWrapper;
