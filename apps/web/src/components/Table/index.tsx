"use client";

import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import React, { useState } from "react";
import { useDebounce } from "usehooks-ts";
import TablePagination from "./TablePagination";
import TableHead from "./TableHead";
import TableBody from "./TableBody";
import GlobalSearch from "./GlobalSearch";

export type TableProps<T> = React.TableHTMLAttributes<HTMLTableElement> & {
  data: T[];
  columns: ColumnDef<T, any>[];

  pagination?: boolean;

  striped?: boolean;

  globalFilter?: boolean;
};

const Table = <T extends any>({
  className,

  data,
  columns,

  pagination = true,
  striped = true,

  globalFilter: useGlobalFilter = true,

  ...rest
}: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const debouncedGlobalFilter = useDebounce(globalFilter, 200);

  const table = useReactTable<T>({
    data,
    columns,

    state: {
      sorting,
      globalFilter: debouncedGlobalFilter,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <GlobalSearch
        value={globalFilter}
        onChange={setGlobalFilter}
        show={useGlobalFilter}
      />

      <table
        className={clsx(
          "table table-sm w-full",
          { "table-zebra": striped },
          className
        )}
        {...rest}
      >
        <TableHead table={table} />
        <TableBody table={table} />
      </table>

      <TablePagination table={table} show={pagination} />
    </>
  );
};
export default Table;
