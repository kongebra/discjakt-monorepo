import { Prisma } from 'database';

export type UpdateStoreDto = Prisma.StoreUpdateInput & {
  // hello world
};
