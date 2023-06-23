import { Prisma } from 'database';

export type CreateStoreDto = Prisma.StoreCreateInput & {
  // hello world
};
