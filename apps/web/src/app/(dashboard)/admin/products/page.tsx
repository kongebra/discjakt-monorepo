import React from "react";

export default async function Page() {
  const products = (await prisma?.product.findMany()) || [];

  return <div>{products?.length}</div>;
}
