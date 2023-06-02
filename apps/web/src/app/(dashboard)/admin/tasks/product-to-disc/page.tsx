import React from "react";
import ProductsList from "./_components/ProductsList";
import { Disc, prisma } from "database";
import SuperSuggestor from "./_components/SuperSuggestor";

export default async function Page() {
  const totalCount = await prisma.product.count({
    where: {
      AND: [
        { discId: null },
        {
          category: "Unknown",
        },
        {
          deletedAt: null,
        },
      ],
    },
  });
  const products = await prisma.product.findMany({
    where: {
      AND: [
        { discId: null },
        {
          category: "Unknown",
        },
        {
          deletedAt: null,
        },
      ],
    },
    include: {
      store: true,
    },
    orderBy: {
      updatedAt: "asc",
    },
    take: 16,
  });
  const discs = await prisma.disc.findMany();
  const mappedDiscs = discs.map((disc) => {
    return {
      ...disc,
      speed: disc.speed.toNumber(),
      glide: disc.glide.toNumber(),
      turn: disc.turn.toNumber(),
      fade: disc.fade.toNumber(),
    } as Disc & {
      speed: number;
      glide: number;
      turn: number;
      fade: number;
    };
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">
        {totalCount} uncatigorised products
      </h1>

      <SuperSuggestor products={products} discs={mappedDiscs} />

      <ProductsList
        totalCount={totalCount}
        products={products}
        discs={mappedDiscs}
      />
    </div>
  );
}
