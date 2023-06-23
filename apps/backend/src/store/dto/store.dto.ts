import { Store } from 'database';

export type StoreDto = Pick<Store, 'name' | 'slug' | 'url'> & {
  productsCount: number;
};
