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

const MiniMarkerButton: React.FC<Props> = ({ product }) => {
  const { trigger, isMutating } = useProductMutation(product.id, {
    onSuccess() {
      router.refresh();
    },
  });

  const router = useRouter();

  if (!product.name.toLowerCase().includes("mini")) {
    return null;
  }

  return (
    <Button
      size="xs"
      color="warning"
      onClick={async () => {
        await trigger({
          category: "Accessories",
        });
      }}
      loading={isMutating}
      disabled={isMutating}
    >
      Mini marker
    </Button>
  );
};

export default MiniMarkerButton;
