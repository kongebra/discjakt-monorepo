"use client";

import Button from "@/components/Button";
import { Product, Store } from "database";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWRMutation from "swr/mutation";
import { useProductMutation } from "../hooks/use-product-mutation";

type Props = {
  product: Product & { store: Store };
};

const haystack = ["backpack", "bag", "bagpack", "bagpak", "bagpakke", "sekk"];

const BagButton: React.FC<Props> = ({ product }) => {
  const { trigger, isMutating } = useProductMutation(product.id, {
    onSuccess() {
      router.refresh();
    },
  });

  const router = useRouter();

  if (!haystack.some((needle) => product.name.toLowerCase().includes(needle))) {
    return null;
  }

  return (
    <Button
      size="xs"
      color="warning"
      onClick={async () => {
        await trigger({
          category: "Bag",
        });
      }}
      loading={isMutating}
      disabled={isMutating}
    >
      Bag
    </Button>
  );
};

export default BagButton;
