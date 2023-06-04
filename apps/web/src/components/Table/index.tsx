'use client';

import {
  ColumnDef,
  SortingState,
  TableState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import Button, { ButtonProps } from '../Button';
import GlobalSearch from './GlobalSearch';
import TableBody from './TableBody';
import TableHead from './TableHead';
import TablePagination from './TablePagination';

export type TableProps<T> = React.TableHTMLAttributes<HTMLTableElement> & {
  data: T[];
  columns: ColumnDef<T, any>[];

  enablePagination?: boolean;

  striped?: boolean;

  enableGlobalFilter?: boolean;

  title?: React.ReactNode;
  buttons?: ButtonProps[];

  state?: Partial<TableState>;

  size?: 'xs' | 'sm' | 'md' | 'lg';
};

const Table = <T extends any>({
  className,

  data,
  columns,

  enablePagination = true,
  striped = true,

  enableGlobalFilter = true,

  title,
  buttons,

  state,

  size,

  ...rest
}: TableProps<T>) => {
  const tableSize = useMemo(() => {
    switch (size) {
      case 'xs':
        return 'table-xs';
      case 'sm':
        return 'table-sm';
      case 'md':
        return 'table-md';
      case 'lg':
        return 'table-lg';
      default:
        return undefined;
    }
  }, [size]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const debouncedGlobalFilter = useDebounce(globalFilter, 200);

  const table = useReactTable<T>({
    data,
    columns,

    state: {
      ...state,
      sorting,
      globalFilter: debouncedGlobalFilter,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-8'>
          {title && <h2 className='text-2xl font-bold'>{title}</h2>}

          <div className='flex items-center gap-4'>
            {buttons?.map((button, i) => (
              <Button key={i} {...button} />
            ))}
          </div>
        </div>

        <GlobalSearch value={globalFilter} onChange={setGlobalFilter} show={enableGlobalFilter} />
      </div>

      <table
        className={clsx('table-sm table w-full', { 'table-zebra': striped }, tableSize, className)}
        {...rest}
      >
        <TableHead table={table} />
        <TableBody table={table} />
      </table>

      <TablePagination table={table} show={enablePagination} />
    </>
  );
};
export default Table;
