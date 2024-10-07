'use client';

import {
  useEffect, useRef, useState,
} from 'react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import dayjs from 'dayjs';
import DataTable from '../../components/DataTable/DataTable';
import { Checkbox } from '../../components/ui/checkbox';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { saciToData } from '../utils/saci';
import { useOnKeyPress } from '../../hooks/onKeyDown';
import styles from './SaciCiv.module.css';

export const columns: ColumnDef<SACIData>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
          || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value: unknown) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: unknown) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ row }) => (
      <div>{dayjs(row.original.date).format('DD/MM/YYYY')}</div>
    ),
    sortingFn: (rowA, rowB) => rowA.original.date.getTime() - rowB.original.date.getTime(),
  },
  {
    accessorKey: 'acft',
    header: 'ACFT',
    cell: ({ row }) => <div>{row.original.acft}</div>,
  },
  {
    accessorKey: 'crew',
    header: 'Trip.',
    cell: ({ row }) => <div>{row.original.crew}</div>,
  },
  {
    accessorKey: 'studentCanac',
    header: 'CANAC',
    cell: ({ row }) => <div>{row.original.studentCanac}</div>,
  },
  {
    accessorKey: 'dep',
    header: 'DEP',
    cell: ({ row }) => <div>{row.original.dep}</div>,
  },
  {
    accessorKey: 'arr',
    header: 'ARR',
    cell: ({ row }) => <div>{row.original.arr}</div>,
  },
  {
    accessorKey: 'tTotal',
    header: 'Total',
    cell: ({ row }) => <div>{row.original.tTotal}</div>,
  },
  {
    accessorKey: 'tDay',
    header: 'DIU',
    cell: ({ row }) => <div>{row.original.tDay}</div>,
  },
  {
    accessorKey: 'tNight',
    header: 'NOT',
    cell: ({ row }) => <div>{row.original.tNight}</div>,
  },
  {
    accessorKey: 'tNav',
    header: 'NAV',
    cell: ({ row }) => <div>{row.original.tNav}</div>,
  },
  {
    accessorKey: 'tIFR',
    header: 'IFR',
    cell: ({ row }) => <div>{row.original.tIFR}</div>,
  },
  {
    accessorKey: 'tCapt',
    header: 'CAPT',
    cell: ({ row }) => <div>{row.original.tCapt}</div>,
  },
  {
    accessorKey: 'ldg',
    header: 'LDG',
    cell: ({ row }) => <div>{row.original.ldg}</div>,
  },
  {
    accessorKey: 'NM',
    header: 'NM',
    cell: ({ row }) => <div>{row.original.NM}</div>,
  },
  {
    accessorKey: 'func',
    header: 'FUNC',
    cell: ({ row }) => <div>{row.original.func}</div>,
  },
  {
    accessorKey: 'obs',
    header: 'OBS',
    cell: ({ row }) => <div>{row.original.obs}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <div>{row.original.status}</div>,
  },
  {
    accessorKey: 'reg',
    header: 'REG',
    cell: ({ row }) => <div>{row.original.reg}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const atIndex = <T, >(data: Array<T>, n: number | null) => {
  if (n === null) return null;
  return data[n];
};

export default function SaciTable({
  saciData,
  setSaciData,
}: {
  saciData: SACIData[] | null
  setSaciData: React.Dispatch<React.SetStateAction<SACIData[] | null>>
}) {
  const [highlightedRow, setHightlightedRow] = useState<number | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useOnKeyPress((e) => {
    if (!saciData) return;
    e.preventDefault();

    if (e.key === 'ArrowDown') {
      setHightlightedRow((row) => {
        if (row === null) return pagination.pageIndex * pagination.pageSize;
        return Math.min((pagination.pageIndex * pagination.pageSize) + 9, row + 1);
      });
    }
    if (e.key === 'ArrowUp') {
      setHightlightedRow((row) => {
        if (row === null) return pagination.pageIndex * pagination.pageSize;
        return Math.max((pagination.pageIndex * pagination.pageSize), row - 1);
      });
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const tableWrapper = tableRef.current?.parentElement;
      if (!tableWrapper) return;
      if (e.key === 'ArrowRight') tableWrapper.scrollBy(50, 0);
      if (e.key === 'ArrowLeft') tableWrapper.scrollBy(-50, 0);
    }
    if (e.key === 'Enter') {
      const table = tableRef.current;
      if (!table) return;
      const hltRow = table.querySelector('tr[data-highlight="true"]');
      if (!hltRow) return;
      const index = hltRow.getAttribute('data-ix');
      if (index === null) return;
      setRowSelection((s) => {
        const copy = { ...s };
        if (index in s) {
          delete copy[index];
          return copy;
        }
        return {
          ...copy,
          [index]: true,
        };
      });
    }
  });

  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    const hltRow = table.querySelector('tr[data-highlight="true"]');
    if (hltRow) hltRow.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [highlightedRow]);

  const uploadSaciData = (e: React.MouseEvent) => {
    e.preventDefault();
    const input = document.createElement('input');
    input.type = 'file';
    input.setAttribute('accept', '.csv, .xlt');
    input.onchange = async function (event) {
      const target = event.target as HTMLInputElement;
      const file = target.files?.item(0);
      if (!file) return;
      const sdata = await saciToData(file);
      setSaciData(sdata);
    };
    input.click();
    input.remove();
  };

  if (saciData) {
    return (
      <div>
        <DataTable
          data={saciData}
          ref={tableRef}
          tableClassName={styles.Table}
          columns={columns}
          highlightedRow={atIndex(saciData, highlightedRow)}
          pagination={pagination}
          setPagination={setPagination}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Button onClick={uploadSaciData}>
        Upload
      </Button>
    </div>
  );
}
