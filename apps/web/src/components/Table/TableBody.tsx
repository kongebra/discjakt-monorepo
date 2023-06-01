"use client";

import { Table, flexRender } from "@tanstack/react-table";
import React from "react";

type Props<T> = {
  table: Table<T>;
};

const TableBody = <T extends any>({ table }: Props<T>) => {
  return (
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
  );
};

export default TableBody;
