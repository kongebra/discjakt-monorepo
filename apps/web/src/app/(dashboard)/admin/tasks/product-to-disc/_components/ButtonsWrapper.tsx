'use client';

import { Disc, Product, Store } from 'database';
import React from 'react';
import AccessoriesButton from './AccessoriesButton';
import BagButton from './BagButton';
import BasketButton from './BasketButton';
import DiscSuggestionButton from './DiscSuggestionButton';
import MiniMarkerButton from './MiniMarkerButton';
import NotADiscButton from './NotADiscButton';
import SelectDiscButton from './SelectDiscButton';
import StarterPackButton from './StarterPackButton';

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
  return (
    <>
      <DiscSuggestionButton product={product} discs={suggestions} />
      <MiniMarkerButton product={product} />
      <StarterPackButton product={product} />
      <SelectDiscButton product={product} discs={discs} />
      <BasketButton product={product} />
      <BagButton product={product} />
      <AccessoriesButton product={product} />
      <NotADiscButton product={product} />
    </>
  );
};

export default ButtonsWrapper;
