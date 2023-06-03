import { Store, prisma } from 'database';
import { productQueue } from '../queue';
import { getStoreCrawlDelay } from '../utils/store';

export async function midnightPriceChecker() {
  // get all stores, their product ids
  const stores = await prisma.store.findMany({
    include: {
      products: {
        select: {
          id: true,
        },
      },
    },
  });

  // perform price check for each store
  await Promise.all(stores.map(checkProductPrices));
}

async function checkProductPrices(store: Store & { products: { id: number }[] }) {
  // get all products for store
  const storeProducts = await prisma.product.findMany({
    where: {
      AND: [
        {
          storeId: store.id,
        },
        {
          // no deleted products
          // TODO: check if we have to do any cleanup on deleted products in the future
          // TODO: can they come back?
          deletedAt: null,
        },
      ],
    },
  });

  let count = 1;
  // loop through products
  for (const product of storeProducts) {
    // get delay for store, and multiply by count
    const delay = getStoreCrawlDelay(store) * count;
    // increment count
    count++;

    // add product to queue
    await productQueue.add(
      {
        lastmod: product.lastmod,
        loc: product.loc,
        storeId: product.storeId,
      },
      {
        delay,
      },
    );
  }
}
