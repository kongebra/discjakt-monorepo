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

const StarterPackButton: React.FC<Props> = ({ product }) => {
  const { trigger, isMutating } = useProductMutation(product.id, {
    onSuccess() {
      router.refresh();
    },
  });

  const router = useRouter();

  if (!product.name.toLowerCase().includes("starter")) {
    return null;
  }

  return (
    <Button
      size="xs"
      color="warning"
      onClick={async () => {
        await trigger({
          category: "Other",
        });
      }}
      loading={isMutating}
      disabled={isMutating}
    >
      Starter pack
    </Button>
  );
};

export default StarterPackButton;
