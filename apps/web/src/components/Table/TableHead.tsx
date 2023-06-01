"use client";

import { Table, flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import React from "react";
import { FaCaretSquareUp, FaCaretSquareDown } from "react-icons/fa";

type Props<T> = {
  table: Table<T>;
};

const TableHead = <T extends any>({ table }: Props<T>) => {
  return (
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
  );
};

export default TableHead;
