"use client";

import Button from "@/components/Button";
import { Disc, Product, Store } from "database";
import React from "react";
import { useBoolean } from "usehooks-ts";
import SelectDiscModal from "./SelectDiscModal";
import { useProductMutation } from "../hooks/use-product-mutation";
import { useRouter } from "next/navigation";

type Props = {
  product: Product & { store: Store };
  suggestions: Disc[];
  discs: Disc[];
  onComplete?: () => void;
};

const CreateNewDiscButton: React.FC<Props> = ({
  product,
  suggestions,
  discs,
  onComplete,
}) => {
  const modal = useBoolean();

  const { trigger, isMutating } = useProductMutation(product.id, {
    onSuccess() {
      onComplete?.();
      modal.setFalse();
    },
  });

  if (suggestions.length > 0) {
    return null;
  }

  return (
    <>
      <Button
        type="button"
        size="xs"
        color="neutral"
        onClick={() => modal.setTrue()}
      >
        Velg disc
      </Button>

      <SelectDiscModal
        product={product}
        open={modal.value}
        onClose={modal.setFalse}
        discs={discs}
        onDiscSelected={async (disc) => {
          await trigger({
            discId: disc.id,
          });
        }}
        isLoading={isMutating}
      />
    </>
  );
};

export default CreateNewDiscButton;
