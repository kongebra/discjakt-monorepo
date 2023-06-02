"use client";

import Button from "@/components/Button";
import { Product, Store } from "database";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import useSWRMutation from "swr/mutation";
import { useProductMutation } from "../hooks/use-product-mutation";
import { FaTimes } from "react-icons/fa";

type Props = {
  product: Product & { store: Store };
};

const NotADiscButton: React.FC<Props> = ({ product }) => {
  const { trigger, isMutating } = useProductMutation(product.id, {
    onSuccess() {
      router.refresh();
    },
  });

  const router = useRouter();

  return (
    <Button
      size="xs"
      color="error"
      onClick={async () => {
        await trigger({
          category: "Other",
        });
      }}
      loading={isMutating}
      disabled={isMutating}
    >
      Not a disc
    </Button>
  );
};

export default NotADiscButton;
