'use client';

import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import {
  useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import dayjs from 'dayjs';
import range from 'lodash/range';
import { Checkbox } from '../../components/ui/checkbox';
import DataTable from '../../components/DataTable/DataTable';
import { useOnKeyPress } from '../../hooks/onKeyDown';
import styles from './SaciCiv.module.css';
import { Button } from '../../components/ui/button';
import CivPages from './civPages';
import PageTotalsDialog from '../../components/PageTotalsDialog/PageTotalsDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

type Props = {
  saciData: SACIData[] | null,
  isMounted: boolean,
}

export const getColumns = ({
  onStartHereClick,
}: {
  onStartHereClick: (row: SACIData) => void
}): ColumnDef<SACIData>[] => [
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
  },
  {
    accessorKey: 'acft',
    header: 'ACFT',
    cell: ({ row }) => <div>{row.original.acft}</div>,
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
    accessorKey: 'obs',
    header: 'OBS',
    cell: ({ row }) => <div>{row.original.obs}</div>,
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
    accessorKey: 'ldg',
    header: 'LDG',
    cell: ({ row }) => <div>{row.original.ldg}</div>,
  },
  {
    accessorKey: 'tNav',
    header: 'NAV',
    cell: ({ row }) => <div>{row.original.tNav}</div>,
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
    accessorKey: 'tTotal',
    header: 'Total',
    cell: ({ row }) => <div>{row.original.tTotal}</div>,
  },
  {
    accessorKey: 'func',
    header: 'FUNC',
    cell: ({ row }) => <div>{row.original.func}</div>,
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
    cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStartHereClick(row.original)}>Começar daqui</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    ),
  },
];

const atIndex = <T, >(data: Array<T>, n: number | null) => {
  if (n === null) return null;
  return data[n];
};

export default function CivTable({
  saciData,
  isMounted,
}: Props) {
  const [civData, setCivData] = useState(saciData);
  const [lastClosedPage, setLastClosedPage] = useState<SACIData[] | null>(null);
  const [showPageTotals, setShowPageTotals] = useState<boolean>(false);
  const [highlightedRow, setHightlightedRow] = useState<number | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [closedPages, setClosedPages] = useState<Record<number, SACIData[]>>({});
  useEffect(() => {
    setHightlightedRow(null);
  }, [pagination.pageIndex]);

  useEffect(() => {
    setCivData(saciData);
  }, [saciData]);

  const onStartHereClick = useCallback((row: SACIData) => {
    if (!civData) return;
    const ix = civData.findIndex((r) => r.id === row.id);
    const rows = range(0, ix + 1).map((i) => civData[i]);
    setRowSelection({});
    setClosedPages({ 1: rows });
    setPagination((pg) => ({ ...pg, pageIndex: 0 }));
  }, [civData]);

  const columns = useMemo(() => getColumns({ onStartHereClick }), [onStartHereClick]);

  const onPageClose = () => {
    if (
      !Object.keys(rowSelection).length
      || !civData
    ) {
      return;
    }
    const rows = Object.entries(rowSelection).reduce((a, [k, v]) => {
      if (v) a.push(Number(k));
      return a;
    }, [] as number[])
      .map((i) => civData[i]);
    setRowSelection({});
    setClosedPages((cp) => {
      const lastPage = Math.max(...Object.keys(cp).map(Number));
      if (!Number.isFinite(lastPage)) return { 1: rows };
      return { ...cp, [lastPage + 1]: rows };
    });
    setPagination((pg) => ({ ...pg, pageIndex: 0 }));
    setShowPageTotals((f) => !f);
  };

  useEffect(() => {
    const latestPage = closedPages[Math.max(...Object.keys(closedPages).map(Number))];
    if (!latestPage) return;
    setLastClosedPage(latestPage);
  }, [showPageTotals]);

  useEffect(() => {
    const idsToRemove = Object.values(closedPages)
      .flatMap((cps) => cps.map((cp) => cp.id));
    setCivData(saciData?.filter((d) => !idsToRemove.includes(d.id)) || null);
  }, [closedPages]);

  useOnKeyPress((e) => {
    if (!civData || !isMounted || !!lastClosedPage) return;
    e.preventDefault();
    const rowStart = pagination.pageIndex * pagination.pageSize;
    const rowEnd = rowStart + pagination.pageSize;

    if (e.key === 'ArrowDown') {
      setHightlightedRow((row) => {
        if (row === null) return rowStart;
        return Math.min(rowEnd - 1, row + 1);
      });
    }
    if (e.key === 'ArrowUp') {
      setHightlightedRow((row) => {
        if (row === null) return rowStart;
        return Math.max(rowStart, row - 1);
      });
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const tableWrapper = tableRef.current?.parentElement;
      if (!tableWrapper) return;
      if (e.key === 'ArrowRight') tableWrapper.scrollBy(50, 0);
      if (e.key === 'ArrowLeft') tableWrapper.scrollBy(-50, 0);
    }

    if (e.ctrlKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      if (e.key === 'ArrowRight') setPagination((pg) => ({ ...pg, pageIndex: Math.min(pg.pageIndex + 1, Math.ceil(civData.length / pg.pageSize)) }));
      if (e.key === 'ArrowLeft') setPagination((pg) => ({ ...pg, pageIndex: Math.max(pg.pageIndex + -1, 0) }));
    }

    if (e.ctrlKey && e.key === 'f' && Object.keys(rowSelection).length) {
      onPageClose();
    }

    if (e.key === 'Enter') {
      const table = tableRef.current;
      if (!table) return;
      const hltRow = table.querySelector('tr[data-highlight="true"]');
      if (!hltRow) return;
      const index = hltRow.getAttribute('data-ix');
      if (index === null) return;
      const indexNum = Number(index) + rowStart;
      setRowSelection((s) => {
        const copy = { ...s };
        if (index in s) {
          // const keysToDelete = Object.keys(s)
          //   .map(Number)
          //   .filter((ix) => ix >= indexNum);
          // keysToDelete.forEach((k) => {
          //   delete copy[k];
          // });
          // return copy;
          delete copy[index];
          return copy;
        }
        return range(0, indexNum + 1)
          .reduce((sel, n) => {
            sel[n] = true;
            return sel;
          }, {} as RowSelectionState);
      });
    }
  });

  useEffect(() => {
    const table = tableRef.current;
    if (!table) return;
    const hltRow = table.querySelector('tr[data-highlight="true"]');
    if (hltRow) hltRow.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [highlightedRow]);

  const onClosedPageDelete = (pg: number) => {
    setClosedPages((cp) => {
      const copy = { ...cp };
      delete copy[pg];
      return copy;
    });
  };

  if (!civData) return null;

  return (
    <>
      <PageTotalsDialog closedPage={lastClosedPage} setClosedPage={setLastClosedPage}/>
      <div className={styles.CivTableContainer}>
        <DataTable
          data={civData}
          ref={tableRef}
          tableClassName={styles.Table}
          columns={columns}
          highlightedRow={atIndex(civData, highlightedRow)}
          pagination={pagination}
          setPagination={setPagination}
          rowSelection={rowSelection}
        />
        {
          Object.keys(rowSelection).length
            ? (
              <Button onClick={onPageClose}>
                Fechar Página
              </Button>
            )
            : null
        }
        <CivPages closedPages={closedPages} onClosedPageDelete={onClosedPageDelete}/>
      </div>
    </>
  );
}
