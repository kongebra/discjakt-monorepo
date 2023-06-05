import { Brand, Disc, DiscType } from 'database';

export type DiscWithLowestPrice = {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;

  speed: number;
  glide: number;
  turn: number;
  fade: number;

  brand: {
    id: number;
    name: string;
    slug: string;
    imageUrl: string | null;
  };

  type: DiscType;
  lowestPrice: number;
};

export type DiscView = Disc & {
  brand: Brand;

  speed: number;
  glide: number;
  turn: number;
  fade: number;

  price: number;
};
