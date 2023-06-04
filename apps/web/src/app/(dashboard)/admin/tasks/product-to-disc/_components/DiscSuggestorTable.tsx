'use client';

import Table from '@/components/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { Disc, Product, Store } from 'database';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { searchDiscs } from '../utils/suggestor';
import BagButton from './BagButton';
import BasketButton from './BasketButton';
import CreateNewDiscButton from './CreateNewDiscButton';
import DiscSuggestionButton from './DiscSuggestionButton';
import MiniMarkerButton from './MiniMarkerButton';
import NotADiscButton from './NotADiscButton';
import SelectDiscButton from './SelectDiscButton';

type Props = {
  totalCount: number;
  products: (Product & { store: Store })[];
  discs: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[];
};

const columnHelper = createColumnHelper<Product & { store: Store }>();

const makeColumns = ({
  discs,
}: {
  discs: (Disc & {
    speed: number;
    glide: number;
    turn: number;
    fade: number;
  })[];
}) => {
  return [
    columnHelper.accessor('imageUrl', {
      cell: (info) => (
        <Image
          src={info.getValue()}
          alt=''
          width={32}
          height={32}
          unoptimized
          className='mask mask-circle'
        />
      ),
      header: () => 'Bilde',
      size: 32,
      maxSize: 32,
    }),
    columnHelper.accessor('name', {
      cell: (info) => (
        <Link
          href={info.row.original.loc}
          target='_blank'
          className='text-indigo-600 hover:text-indigo-700'
        >
          {info.getValue()}
        </Link>
      ),
      header: () => 'Produktnavn',
      minSize: 500,
    }),
    columnHelper.display({
      id: 'discSuggestions',
      header: () => 'Disc forslag',
      cell: (info) => {
        const suggestions = searchDiscs(info.row.original, discs);
        return <DiscSuggestionButton product={info.row.original} discs={suggestions} />;
      },
      minSize: 300,
    }),
    columnHelper.display({
      id: 'createDisc',
      header: () => 'Lag disc',
      cell: (info) => <CreateNewDiscButton product={info.row.original} />,
    }),
    columnHelper.display({
      id: 'selectDisc',
      header: () => 'Velg disc',
      cell: (info) => <SelectDiscButton product={info.row.original} discs={discs} />,
      minSize: 150,
      size: 150,
      maxSize: 150,
    }),
    columnHelper.display({
      id: 'other',
      header: () => 'Andre',
      cell: (info) => (
        <div className='flex items-center gap-2'>
          <BagButton product={info.row.original} />
          <MiniMarkerButton product={info.row.original} />
          <BasketButton product={info.row.original} />
        </div>
      ),
      size: 340,
      maxSize: 340,
    }),
    columnHelper.display({
      id: 'notADisc',
      header: () => 'Ikke en disc',
      cell: (info) => <NotADiscButton product={info.row.original} />,
      size: 100,
      maxSize: 100,
    }),
  ];
};

const DiscSuggestorTable: React.FC<Props> = ({ products, discs }) => {
  const columns = makeColumns({ discs });

  return (
    <Table
      enablePagination={false}
      //   enableGlobalFilter={false}
      size='xs'
      data={products}
      columns={columns}
    />
  );
};

export default DiscSuggestorTable;
