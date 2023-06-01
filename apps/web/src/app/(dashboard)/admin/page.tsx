import { prisma } from "database";
import Link from "next/link";
import React from "react";

async function fetchBrands() {
  const brands = await prisma.brand.findMany();

  return brands;
}

export default async function Page() {
  const brands = await prisma.brand.findMany();
  const stores = await prisma.store.findMany();
  const products = await prisma.product.findMany();
  const discs = await prisma.disc.findMany();

  return (
    <div>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Brands Count</div>
          <div className="stat-value">{brands.length}</div>
          <div className="stat-desc">All brands</div>
        </div>

        <div className="stat">
          <div className="stat-title">Store Count</div>
          <div className="stat-value">{stores.length}</div>
          <div className="stat-desc">All stores</div>
        </div>

        <div className="stat">
          <div className="stat-title">Products Count</div>
          <div className="stat-value">{products.length}</div>
          <div className="stat-desc">All products</div>
        </div>

        <div className="stat">
          <div className="stat-title">Discs Count</div>
          <div className="stat-value">{discs.length}</div>
          <div className="stat-desc">All discs</div>
        </div>
      </div>
    </div>
  );
}
