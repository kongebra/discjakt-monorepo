"use client";

import Button from "@/components/Button";
import { Disc, Product, Store } from "database";
import React from "react";
import { useProductMutation } from "../hooks/use-product-mutation";
import { useRouter } from "next/navigation";
import CreateNewDiscButton from "./CreateNewDiscButton";

type Props = {
  product: Product & { store: Store };
  discs: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[];
};

const DiscSuggestionButton: React.FC<Props> = ({ product, discs }) => {
  const { trigger, isMutating } = useProductMutation(product.id, {
    onSuccess() {
      router.refresh();
    },
  });

  const router = useRouter();

  if (discs.length === 0) {
    return <CreateNewDiscButton product={product} />;
  }

  return (
    <>
      {discs.map((disc) => {
        return (
          <Button
            key={disc.id}
            size="xs"
            color="info"
            onClick={async () => {
              await trigger({
                category: "Disc",
                discId: disc.id,
              });
            }}
            loading={isMutating}
            disabled={isMutating}
          >
            {disc.name}
          </Button>
        );
      })}
    </>
  );
};

export default DiscSuggestionButton;
