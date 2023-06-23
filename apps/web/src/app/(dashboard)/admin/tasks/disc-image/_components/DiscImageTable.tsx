'use client';

import Button from '@/components/Button';
import Table from '@/components/Table';
import { createColumnHelper } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import DiscImageModal from '../../../discs/_components/DiscImageModal';
import { DiscsTableItem } from '../../../discs/_components/DiscsTable';

type Props = {
  discs: DiscsTableItem[];
};

const columnHelper = createColumnHelper<DiscsTableItem>();

const makeColumns = (onClick: (item: DiscsTableItem) => void) => {
  return [
    columnHelper.accessor('name', {
      header: () => 'Disc',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'button',
      header: () => 'Velg bild',
      cell: (info) => {
        return (
          <Button size='sm' onClick={() => onClick(info.row.original)}>
            Velg bilde
          </Button>
        );
      },
    }),
  ];
};

const DiscImageTable: React.FC<Props> = ({ discs }) => {
  const router = useRouter();
  const [selectedDisc, setSelectedDisc] = useState<DiscsTableItem | undefined>(undefined);

  const columns = makeColumns(setSelectedDisc);

  return (
    <>
      <Table data={discs} columns={columns} />
      <DiscImageModal
        disc={selectedDisc}
        onClose={() => {
          router.refresh();
          setSelectedDisc(undefined);
        }}
        open={!!selectedDisc}
      />
    </>
  );
};

export default DiscImageTable;
