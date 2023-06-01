"use client";

import { Table } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";

type Props<T> = {
  table: Table<T>;
  show?: boolean;
};

const TablePagination = <T extends any>({ table, show }: Props<T>) => {
  if (show === false) {
    return null;
  }

  return (
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

        {table.getPageOptions().map((page, index) => {
          const pageIndex = table.getState().pagination.pageIndex;
          const totalPages = table.getPageOptions().length;

          if (
            index === 0 || // Always display the first page
            index === totalPages - 1 || // Always display the last page
            Math.abs(page - pageIndex) < 2 // Display pages close to the current page
          ) {
            return (
              <button
                key={page}
                className={clsx("join-item btn btn-sm", {
                  "btn-primary": pageIndex === page,
                })}
                onClick={() => table.setPageIndex(page)}
              >
                {page + 1}
              </button>
            );
          } else if (
            index === 1 || // Always display the second page
            index === totalPages - 2 // Always display the second to last page
          ) {
            return (
              <button className="btn btn-sm btn-disabled join-item" key={page}>
                ...
              </button>
            ); // Ellipses for spaced pages
          }

          return null;
        })}

        <button
          className="join-item btn btn-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
