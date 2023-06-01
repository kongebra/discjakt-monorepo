"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import React, { useState } from "react";
import { FaCaretSquareUp, FaCaretSquareDown } from "react-icons/fa";

export type TableProps<T> = React.TableHTMLAttributes<HTMLTableElement> & {
  data: T[];
  columns: ColumnDef<T, any>[];

  pagination?: boolean;
};

const Table = <T extends any>({
  className,

  data,
  columns,

  pagination,

  ...rest
}: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable<T>({
    data,
    columns,

    state: {
      sorting,
    },

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <table className={clsx("table table-sm w-full", className)} {...rest}>
        <thead className="bg-base-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="text-base">
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: clsx(
                            "flex items-center justify-between",
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          ),
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <FaCaretSquareUp />,
                          desc: <FaCaretSquareDown />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between py-4 w-full">
        <div>
          <select
            className="select select-bordered select-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(parseInt(e.target.value));
            }}
          >
            <option disabled>Select page size</option>
            <option value="5">5 rows</option>
            <option value="10">10 rows</option>
            <option value="25">25 rows</option>
            <option value="50">50 rows</option>
          </select>
        </div>

        <div className="join">
          <button
            className="join-item btn btn-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>

          {table.getPageOptions().map((page) => (
            <button
              key={page}
              className={clsx("join-item btn btn-sm", {
                "btn-active": table.getState().pagination.pageIndex === page,
              })}
              onClick={() => table.setPageIndex(page)}
            >
              {page + 1}
            </button>
          ))}

          <button
            className="join-item btn btn-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};
export default Table;
