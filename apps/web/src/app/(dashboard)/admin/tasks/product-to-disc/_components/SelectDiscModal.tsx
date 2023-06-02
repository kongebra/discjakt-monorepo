"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import { Disc, Product, Store } from "database";
import React, { useCallback, useMemo } from "react";
import { useDebounce } from "usehooks-ts";
import { useBrands } from "../hooks/use-brands";

type Props = {
  product: Product & { store: Store };
  open: boolean;
  onClose: () => void;
  discs: Disc[];
  onDiscSelected: (disc: Disc) => void;
  isLoading?: boolean;
};

const SelectDiscModal: React.FC<Props> = ({
  product,
  open,
  onClose,
  discs,
  onDiscSelected,
  isLoading,
}) => {
  const [value, setValue] = React.useState("");
  const debouncedValue = useDebounce(value, 200);

  const { data: brands } = useBrands();

  const searchResult = useMemo(() => {
    if (!debouncedValue) {
      return [];
    }

    return discs.filter((disc) => {
      return disc.name.toLowerCase().includes(debouncedValue.toLowerCase());
    });
  }, [debouncedValue, discs]);

  const findBrandName = useCallback(
    (brandId: number) => {
      return brands?.find((brand) => brand.id === brandId)?.name;
    },
    [brands]
  );

  return (
    <Modal
      title={`Velg disc for ${product.name}`}
      open={open}
      onClose={onClose}
    >
      <Input
        className="mb-4"
        label="Søk etter disc"
        placeholder="Søk etter disc"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        disabled={isLoading}
      />

      <div className="flex flex-col gap-2">
        {searchResult.slice(0, 16).map((disc) => (
          <Button
            key={disc.id}
            size="sm"
            onClick={() => {
              onDiscSelected(disc);
            }}
            disabled={isLoading}
            loading={isLoading}
          >
            {disc.name} ({findBrandName(disc.brandId)})
          </Button>
        ))}
      </div>
    </Modal>
  );
};

export default SelectDiscModal;
