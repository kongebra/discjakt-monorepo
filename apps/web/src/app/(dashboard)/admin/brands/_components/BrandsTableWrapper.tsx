"use client";

import React, { useState } from "react";
import BrandsTable, { BrandsTableItem } from "./BrandsTable";

type Props = {
  brands: BrandsTableItem[];
};

const BrandsTableWrapper: React.FC<Props> = ({ brands }) => {
  const [selectedBrand, setSelectedBrand] = useState<
    BrandsTableItem | undefined
  >(undefined);

  return (
    <>
      <BrandsTable brands={brands} onClick={setSelectedBrand} />
    </>
  );
};

export default BrandsTableWrapper;
