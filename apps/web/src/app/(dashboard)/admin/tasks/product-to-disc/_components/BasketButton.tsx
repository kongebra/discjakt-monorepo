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

const haystack = ["kurv", "basket", "target"];

const BasketButton: React.FC<Props> = ({ product }) => {
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
          category: "Basket",
        });
      }}
      loading={isMutating}
      disabled={isMutating}
    >
      Kurv
    </Button>
  );
};

export default BasketButton;
