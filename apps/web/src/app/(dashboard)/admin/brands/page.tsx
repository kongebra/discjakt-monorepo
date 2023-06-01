import React from "react";
import { prisma } from "database";
import BrandsTableWrapper from "./_components/BrandsTableWrapper";

export default async function Page() {
  const brands = await prisma.brand.findMany({
    include: {
      _count: {
        select: {
          discs: true,
          plastics: true,
        },
      },
    },
  });

  return (
    <div>
      <BrandsTableWrapper brands={brands} />
    </div>
  );
}
