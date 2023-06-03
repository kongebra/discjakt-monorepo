import React from "react";
import { prisma } from "database";

export default async function Page() {
  const products = await prisma?.product.findMany();

  return <div>{products?.length}</div>;
}
