import { getTimeSinceDate } from "@/utils/date";
import { Disc, Product, Store } from "database";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaTimes } from "react-icons/fa";
import DiscSuggestor from "./DiscSuggestor";

type Props = {
  totalCount: number;
  products: (Product & { store: Store })[];
  discs: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[];
};

const ProductsList: React.FC<Props> = ({ products, discs }) => {
  return (
    <div className="flex flex-col">
      <ul role="list" className="divide-y">
        {products.map((product) => (
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
                  <Link
                    className="text-indigo-600 hover:text-indigo-700"
                    href={product.loc}
                    target="_blank"
                  >
                    {product.name}
                  </Link>
                </h3>

                <p className="text-gray-500 text-sm text-ellipsis overflow-hidden whitespace-nowrap mt-3">
                  Scraped from{" "}
                  <Link
                    className="text-indigo-600 hover:text-indigo-700 font-semibold mr-1"
                    href={product.store.url}
                    target="_blank"
                  >
                    {product.store.name}
                  </Link>
                  <time
                    dateTime={product.updatedAt.toString()}
                    className="text-gray-500"
                  >
                    {getTimeSinceDate(product.updatedAt)}
                  </time>
                  {" ago"}
                </p>
              </div>

              <DiscSuggestor discs={discs} product={product} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsList;
