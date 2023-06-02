import { getTimeSinceDate } from "@/utils/date";
import { prisma } from "database";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaTimes } from "react-icons/fa";

export default async function Page() {
  const brands = await prisma.brand.findMany();
  const stores = await prisma.store.findMany();
  const products = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
  });
  const discs = await prisma.disc.findMany();

  const unknownProducts = products.filter(
    (product) => product.category === "Unknown"
  );

  return (
    <div>
      <div className="stats shadow w-full bg-base-200 mb-8">
        <div className="stat">
          <div className="stat-title">Brands Count</div>
          <div className="stat-value">{brands.length}</div>
          {/* <div className="stat-desc">All brands</div> */}
        </div>

        <div className="stat">
          <div className="stat-title">Store Count</div>
          <div className="stat-value">{stores.length}</div>
          {/* <div className="stat-desc">All stores</div> */}
        </div>

        <div className="stat">
          <div className="stat-title">Products Count</div>
          <div className="stat-value">{products.length}</div>
          {/* <div className="stat-desc">All products</div> */}
        </div>

        <div className="stat">
          <div className="stat-title">Unknown Products</div>
          <div className="stat-value">{unknownProducts.length}</div>
          {/* <div className="stat-desc">With unknown category</div> */}
        </div>

        <div className="stat">
          <div className="stat-title">Discs Count</div>
          <div className="stat-value">{discs.length}</div>
          {/* <div className="stat-desc">All discs</div> */}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 sm:grid-cols-2">
        <div className="bg-base-200 rounded-lg shadow">
          <header className="lg:px-8 sm:py-6 sm:px-6 px-4 py-4 border-b border-gray-400 flex items-center justify-between">
            <h2 className="text-gray-900 leading-6 font-semibold text-base">
              Latest updated products
            </h2>

            <Link
              href="#"
              className="text-indigo-600 leading-6 font-semibold text-sm"
            >
              View all
            </Link>
          </header>

          <ul role="list" className="divide-x-1">
            {products.slice(0, 8).map((product) => (
              <li key={product.id} className="lg:px-8 sm:px-6 px-4 py-4">
                <div className="gap-x-3 flex items-center">
                  {product.imageUrl === "none" ? (
                    <span className="bg-gray-800 rounded-full flex-none w-12 h-12 flex items-center justify-center">
                      <FaTimes className="text-red-500 w-10 h-10 animate-pulse" />
                    </span>
                  ) : (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="bg-gray-800 rounded-full flex-none w-12 h-12"
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="text-gray-900 leading-6 font-semibold text-sm text-ellipsis overflow-hidden whitespace-nowrap">
                      {product.name}
                    </h3>

                    <p className="text-gray-500 text-sm text-ellipsis overflow-hidden whitespace-nowrap mt-3">
                      Scraped from{" "}
                      <span className="text-gray-700">
                        {
                          stores.find((store) => store.id === product.storeId)
                            ?.name
                        }
                      </span>
                    </p>
                  </div>

                  <time
                    dateTime={product.updatedAt.toString()}
                    className="text-gray-500 text-xs flex-none"
                  >
                    {getTimeSinceDate(product.updatedAt)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
