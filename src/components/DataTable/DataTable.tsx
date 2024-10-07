'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import styles from './DataTable.module.css';

type DataTableProps<T extends Record<PropertyKey, string | number | Date | boolean> & {id: string}> = {
  data: T[];
  columns: ColumnDef<T>[];
  highlightedRow?: T | null;
  pagination: {
    pageIndex: number;
    pageSize: number;
  },
  tableClassName?: string,
  setPagination: React.Dispatch<React.SetStateAction<{
    pageIndex: number;
    pageSize: number;
  }>>,
  rowSelection: RowSelectionState
  setRowSelection?: OnChangeFn<RowSelectionState>
}

function DataTbl<T extends Record<PropertyKey, string | number | Date | boolean> & {id: string}>({
  data,
  columns,
  highlightedRow,
  pagination,
  tableClassName,
  setPagination,
  rowSelection,
  setRowSelection,
}: DataTableProps<T>, ref: React.ForwardedRef<HTMLTableElement>) {
  const tblRef = React.useRef<HTMLTableElement>(null);
  React.useImperativeHandle(ref, () => tblRef.current!, [tblRef]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection as any,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const nextPage = () => {
    if (!table.getCanNextPage()) return;
    setPagination((p) => ({
      ...p,
      pageIndex: p.pageIndex + 1,
    }));
  };

  const prevPage = () => {
    if (!table.getCanNextPage()) return;
    setPagination((p) => ({
      ...p,
      pageIndex: p.pageIndex - 1,
    }));
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: unknown) => column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table ref={tblRef} className={tableClassName}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  data-highlight={row.original.id === highlightedRow?.id}
                  className={styles.Tr}
                  data-ix={i}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}

const DataTable = React.forwardRef(DataTbl) as <T extends Record<PropertyKey, string | number | Date | boolean> & {id: string}>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<HTMLTableElement> }
) => ReturnType<typeof DataTbl>;

export default DataTable;
