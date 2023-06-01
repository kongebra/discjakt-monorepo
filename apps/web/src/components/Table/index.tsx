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
import Button, { ButtonProps } from "../Button";

export type TableProps<T> = React.TableHTMLAttributes<HTMLTableElement> & {
  data: T[];
  columns: ColumnDef<T, any>[];

  pagination?: boolean;

  striped?: boolean;

  globalFilter?: boolean;

  title?: React.ReactNode;
  buttons?: ButtonProps[];
};

const Table = <T extends any>({
  className,

  data,
  columns,

  pagination = true,
  striped = true,

  globalFilter: useGlobalFilter = true,

  title,
  buttons,

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-8">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}

          <div className="flex items-center gap-4">
            {buttons?.map((button, i) => (
              <Button key={i} {...button} />
            ))}
          </div>
        </div>

        <GlobalSearch
          value={globalFilter}
          onChange={setGlobalFilter}
          show={useGlobalFilter}
        />
      </div>

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
