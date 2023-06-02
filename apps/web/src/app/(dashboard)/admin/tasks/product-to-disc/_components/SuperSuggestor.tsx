import { Disc, Product, Store } from "database";
import React from "react";
import { searchDiscs } from "../utils/suggestor";
import Button from "@/components/Button";
import SuperSuggestorButton from "./SuperSuggestorButton";

type Props = {
  products: (Product & { store: Store })[];
  discs: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[];
};

const SuperSuggestor: React.FC<Props> = ({ products, discs }) => {
  const suggestions = products.map((product) => {
    const suggestions = searchDiscs(product, discs);

    return {
      product,
      suggestions,
    };
  });

  const canAllAutoSuggest = products.every((product) => {
    const suggestions = searchDiscs(product, discs);
    return suggestions.length === 1;
  });

  if (canAllAutoSuggest) {
    return <SuperSuggestorButton suggestions={suggestions} />;
  }

  return null;
};

export default SuperSuggestor;
