"use client";

import { Disc, Product, Store } from "database";
import React, { useEffect, useState } from "react";
import AccessoriesButton from "./AccessoriesButton";
import BasketButton from "./BasketButton";
import DiscSuggestionButton from "./DiscSuggestionButton";
import MiniMarkerButton from "./MiniMarkerButton";
import NotADiscButton from "./NotADiscButton";
import SelectDiscButton from "./SelectDiscButton";
import StarterPackButton from "./StarterPackButton";
import { useInterval, useTimeout } from "usehooks-ts";
import BagButton from "./BagButton";

type Props = {
  product: Product & { store: Store };
  discs: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[];
  suggestions: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[];
};

const ButtonsWrapper: React.FC<Props> = ({ product, discs, suggestions }) => {
  const [start, setStart] = useState(false);
  const [value, setValue] = useState(false);
  const toggle = () => {
    if (!start) {
      setStart(true);
    }

    setValue((prev) => !prev);
  };

  useEffect(() => {
    if (start) {
      const timeout = setTimeout(() => {
        console.log("refresh");
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [start, value]);

  return (
    <>
      <DiscSuggestionButton product={product} discs={suggestions} />
      <MiniMarkerButton product={product} />
      <StarterPackButton product={product} />
      <SelectDiscButton
        product={product}
        discs={discs}
        suggestions={suggestions}
        onComplete={toggle}
      />
      <BasketButton product={product} />
      <BagButton product={product} />
      <AccessoriesButton product={product} />
      <NotADiscButton product={product} />
    </>
  );
};

export default ButtonsWrapper;
