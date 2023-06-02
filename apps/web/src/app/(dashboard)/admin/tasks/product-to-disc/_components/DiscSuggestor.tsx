import { Disc, Product, Store } from "database";
import React from "react";
import ButtonsWrapper from "./ButtonsWrapper";
import { searchDiscs } from "../utils/suggestor";

type Props = {
  product: Product & { store: Store };
  discs: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[];
};

const DiscSuggestor: React.FC<Props> = ({ product, discs }) => {
  const suggestions = searchDiscs(product, discs);

  return (
    <div className="flex flex-wrap justify-end gap-4">
      <ButtonsWrapper
        product={product}
        discs={discs}
        suggestions={suggestions}
      />
    </div>
  );
};

export default DiscSuggestor;
