"use client";

import Button from "@/components/Button";
import React from "react";
import { updateProduct } from "../hooks/use-product-mutation";
import { useRouter } from "next/navigation";

type Props = {
  suggestions: {
    product: any;
    suggestions: any[];
  }[];
};

const SuperSuggestorButton: React.FC<Props> = ({ suggestions }) => {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  return (
    <Button
      type="button"
      color="primary"
      onClick={async () => {
        setLoading(true);
        const promises = suggestions.map(async (suggestion) => {
          return await updateProduct(`/api/products/${suggestion.product.id}`, {
            arg: { discId: suggestion.suggestions[0].id },
          });
        });

        await Promise.all(promises).finally(() => {
          setLoading(false);
          router.refresh();
        });
      }}
      className="mb-4"
      loading={loading}
      disabled={loading}
    >
      Auto suggest all
    </Button>
  );
};

export default SuperSuggestorButton;
