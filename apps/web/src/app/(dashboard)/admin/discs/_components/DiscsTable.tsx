'use client';

import Button from '@/components/Button';
import Table from '@/components/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { Brand, Disc, Product } from 'database';
import React, { useMemo } from 'react';

export type DiscsTableItem = Disc & {
  speed: number;
  glide: number;
  turn: number;
  fade: number;

  brand: Brand;
  products: Product[];

  _count: {
    products: number;
    bags: number;
    users: number;
  };
};

type Props = {
  discs: DiscsTableItem[];
  onClick?: (item: DiscsTableItem, action: Action) => void;
  onClickCreate?: () => void;
};

const columnHelper = createColumnHelper<DiscsTableItem>();

type Action = 'disc.edit' | 'disc.edit.image';

const makeColumns = (onClick?: (item: DiscsTableItem, action: Action) => void) => {
  return [
    // columnHelper.accessor('id', {
    //   cell: (info) => <strong className='font-mono'>{info.getValue()}</strong>,
    //   header: () => 'ID',
    // }),
    columnHelper.accessor('name', {
      cell: (info) => info.getValue(),
      header: () => 'Navn',
      size: 100,
      maxSize: 150,
    }),
    columnHelper.accessor('brand.name', {
      cell: (info) => info.getValue(),
      header: () => 'Merke',
      size: 100,
      maxSize: 150,
    }),
    columnHelper.accessor('type', {
      cell: (info) => info.getValue(),
      header: () => 'Type',
      size: 50,
      maxSize: 50,
    }),
    columnHelper.accessor('speed', {
      cell: (info) => (
        <span className='badge font-xs w-full bg-green-300 font-semibold'>{info.getValue()}</span>
      ),
      header: () => 'Speed',
      size: 50,
      maxSize: 50,
    }),
    columnHelper.accessor('glide', {
      cell: (info) => (
        <span className='badge font-xs w-full bg-orange-300 font-semibold'>{info.getValue()}</span>
      ),
      header: () => 'Glide',
      size: 35,
      maxSize: 35,
    }),
    columnHelper.accessor('turn', {
      cell: (info) => (
        <span className='badge font-xs w-full bg-blue-300 font-semibold'>{info.getValue()}</span>
      ),
      header: () => 'Turn',
      size: 50,
      maxSize: 50,
    }),
    columnHelper.accessor('fade', {
      cell: (info) => (
        <span className='badge font-xs w-full bg-yellow-300 font-semibold'>{info.getValue()}</span>
      ),
      header: () => 'Fade',
      size: 50,
      maxSize: 50,
    }),
    columnHelper.accessor('_count.products', {
      cell: (info) => <span className='badge font-xs w-full font-semibold'>{info.getValue()}</span>,
      header: () => 'Produkter',
      size: 50,
      maxSize: 50,
    }),
    // columnHelper.accessor('_count.bags', {
    //   cell: (info) => <span className='font-mono'>{info.getValue()}</span>,
    //   header: () => 'Bagger',
    // }),
    // columnHelper.accessor('_count.users', {
    //   cell: (info) => <span className='font-mono'>{info.getValue()}</span>,
    //   header: () => 'Brukere',
    // }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => (
        <div className='join'>
          <Button
            size='sm'
            onClick={() => onClick?.(info.row.original, 'disc.edit.image')}
            className='join-item'
            color={info.row.original.imageUrl ? 'success' : 'error'}
            outline
          >
            Endre bilde
          </Button>
          <Button
            outline
            size='sm'
            onClick={() => onClick?.(info.row.original, 'disc.edit')}
            className='join-item'
          >
            Endre disc
          </Button>
        </div>
      ),
      header: () => 'Handlinger',
      enableSorting: false,
      minSize: 150,
    }),
  ];
};

const DiscsTable: React.FC<Props> = ({ discs, onClick, onClickCreate }) => {
  const columns = useMemo(() => makeColumns(onClick), [onClick]);

  return (
    <Table
      title='Discer'
      buttons={[
        {
          children: 'Lag ny disc',
          size: 'sm',
          color: 'primary',
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
