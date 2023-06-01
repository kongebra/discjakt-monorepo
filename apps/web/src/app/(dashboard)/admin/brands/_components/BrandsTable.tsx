"use client";

import Button from "@/components/Button";
import Table from "@/components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { Brand } from "database";
import React, { useMemo } from "react";

export type BrandsTableItem = Brand & {
  _count: {
    discs: number;
    plastics: number;
  };
};

type Props = {
  brands: BrandsTableItem[];
  onClick?: (item: BrandsTableItem) => void;
};

const columnHelper = createColumnHelper<BrandsTableItem>();

const makeColumns = (onClick?: (item: BrandsTableItem) => void) => {
  return [
    columnHelper.accessor("id", {
      cell: (info) => <strong className="font-mono">{info.getValue()}</strong>,
      header: () => "ID",
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: () => "Navn",
    }),
    columnHelper.accessor("slug", {
      cell: (info) => info.getValue(),
      header: () => "Slug",
    }),
    columnHelper.accessor("_count.discs", {
      cell: (info) => <span className="font-mono">{info.getValue()}</span>,
      header: () => "Antall disker",
    }),
    columnHelper.accessor("_count.plastics", {
      cell: (info) => <span className="font-mono">{info.getValue()}</span>,
      header: () => "Antall plastiker",
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => (
        <Button
          color="ghost"
          size="sm"
          onClick={() => onClick?.(info.row.original)}
        >
          Endre
        </Button>
      ),
      header: () => "Handlinger",
      enableSorting: false,
    }),
  ];
};

const BrandsTable: React.FC<Props> = ({ brands, onClick }) => {
  const columns = useMemo(() => makeColumns(onClick), [onClick]);

  return <Table striped data={brands} columns={columns} />;
};

export default BrandsTable;
