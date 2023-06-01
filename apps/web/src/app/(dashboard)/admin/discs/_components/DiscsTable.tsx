"use client";

import Button from "@/components/Button";
import Table from "@/components/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { Brand, Disc } from "database";
import React, { useMemo } from "react";

export type DiscsTableItem = Disc & {
  speed: number;
  glide: number;
  turn: number;
  fade: number;

  brand: Brand;
  _count: {
    products: number;
    bags: number;
    users: number;
  };
};

type Props = {
  discs: DiscsTableItem[];
  onClick?: (item: DiscsTableItem) => void;
  onClickCreate?: () => void;
};

const columnHelper = createColumnHelper<DiscsTableItem>();

const makeColumns = (onClick?: (item: DiscsTableItem) => void) => {
  return [
    columnHelper.accessor("id", {
      cell: (info) => <strong className="font-mono">{info.getValue()}</strong>,
      header: () => "ID",
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: () => "Navn",
    }),
    columnHelper.accessor("brand.name", {
      cell: (info) => info.getValue(),
      header: () => "Merke",
    }),
    columnHelper.accessor("type", {
      cell: (info) => info.getValue(),
      header: () => "Type",
    }),
    columnHelper.accessor("speed", {
      cell: (info) => info.getValue(),
      header: () => "Speed",
    }),
    columnHelper.accessor("glide", {
      cell: (info) => info.getValue(),
      header: () => "Glide",
    }),
    columnHelper.accessor("turn", {
      cell: (info) => info.getValue(),
      header: () => "Turn",
    }),
    columnHelper.accessor("fade", {
      cell: (info) => info.getValue(),
      header: () => "Fade",
    }),
    columnHelper.accessor("_count.products", {
      cell: (info) => <span className="font-mono">{info.getValue()}</span>,
      header: () => "Produkter",
    }),
    columnHelper.accessor("_count.bags", {
      cell: (info) => <span className="font-mono">{info.getValue()}</span>,
      header: () => "Bagger",
    }),
    columnHelper.accessor("_count.users", {
      cell: (info) => <span className="font-mono">{info.getValue()}</span>,
      header: () => "Brukere",
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

const DiscsTable: React.FC<Props> = ({ discs, onClick, onClickCreate }) => {
  const columns = useMemo(() => makeColumns(onClick), [onClick]);

  return (
    <Table
      title="Discer"
      buttons={[
        {
          children: "Lag ny disc",
          size: "sm",
          color: "primary",
          onClick: () => onClickCreate?.(),
        },
      ]}
      striped
      data={discs}
      columns={columns}
    />
  );
};

export default DiscsTable;
