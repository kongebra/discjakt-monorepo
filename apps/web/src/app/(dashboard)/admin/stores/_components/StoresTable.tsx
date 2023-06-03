"use client";

import Button from "@/components/Button";
import Table from "@/components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { Store } from "database";
import React from "react";

export type StoresTableItem = Store & {
  _count: {
    products: number;
  };
};

type Props = {
  stores: StoresTableItem[];
  onClick?: (item: StoresTableItem) => void;
};

const columnHelper = createColumnHelper<StoresTableItem>();

const makeColumns = (onClick?: (item: StoresTableItem) => void) => {
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
    columnHelper.accessor("url", {
      cell: (info) => info.getValue(),
      header: () => "URL",
    }),
    columnHelper.accessor("_count.products", {
      cell: (info) => <span className="font-mono">{info.getValue()}</span>,
      header: () => "Antall produkter",
    }),
    columnHelper.display({
      id: "actions",
      cell: (info) => (
        <Button ghost size="sm" onClick={() => onClick?.(info.row.original)}>
          Endre
        </Button>
      ),
      header: () => "Handlinger",
      enableSorting: false,
    }),
  ];
};

const StoresTable: React.FC<Props> = ({ stores, onClick }) => {
  const columns = React.useMemo(() => makeColumns(onClick), [onClick]);

  return <Table striped data={stores} columns={columns} />;
};

export default StoresTable;
