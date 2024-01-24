"use client";
import {
  ColumnDef,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dispatch, SetStateAction } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelection: RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowSelection,
  setRowSelection,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    getRowId: (row) => row.id,
    enableRowSelection: (row) =>
      row?.original?.payOutStatus !== "requested" &&
      row?.original?.payOutStatus !== "paid",
  });

  return (
    <div className="rounded-md border max-w-full">
      <Table className="max-w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              style={{
                display: "grid",
                gridTemplateColumns: `auto 1.5fr repeat(${
                  columns.length - 2
                }, minmax(0, 1fr))`,
              }}
              key={headerGroup.id}
              className="max-w-full gap-2 bg-gray-100"
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="text-gray-700 font-medium px-1 pt-2"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="max-w-full">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                style={{
                  display: "grid",
                  gridTemplateColumns: `auto 1.5fr repeat(${
                    columns.length - 2
                  }, minmax(0, 1fr))`,
                }}
                className="max-w-full grid grid-cols-[auto_1.5fr_repeat(8,_minmax(0,_1fr))]  gap-2"
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="py-4 px-1 text-gray-600 text-sm font-medium"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
