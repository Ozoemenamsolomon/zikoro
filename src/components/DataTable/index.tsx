"use client";
import {
  ColumnDef,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  Row,
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  rowSelection?: RowSelectionState;
  setRowSelection?: Dispatch<SetStateAction<RowSelectionState>>;
  canSelectRow?: (row: Row<TData>) => boolean;
  rowStyle: React.CSSProperties;
}

export function DataTable<TData extends { id?: number }>({
  columns,
  data,
  rowSelection,
  setRowSelection,
  canSelectRow,
  rowStyle,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    getRowId: (row) => (row?.id ? row?.id.toString() : ""),
    enableRowSelection: canSelectRow || true,
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <div className="flex items-center justify-center gap-4 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="text-gray-700 disabled:text-gray-300 !p-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={9}
            height={14}
            viewBox="0 0 9 14"
            fill="none"
          >
            <path
              d="M7.5 13L1.5 7L7.5 1"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <div className="flex items-center gap-2 text-gray-500 font-medium w-max text-sm">
          <span>Page</span>
          <Select
            value={table.getState().pagination.pageIndex.toString()}
            onValueChange={(value: any) => table.setPageIndex(value as number)}
          >
            <SelectTrigger className="pt-1 pb-0 px-2">
              <SelectValue className="placeholder:text-sm placeholder:text-gray-200 text-gray-700" />
            </SelectTrigger>
            <SelectContent className="max-h-64 hide-scrollbar overflow-auto">
              {table.getPageOptions().map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>of</span>
          <span>{table.getPageCount()}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="text-gray-700 disabled:text-gray-300 !p-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M8.5 6L14.5 12L8.5 18"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <div className="flex gap-2 items-center font-medium text-gray-700 text-sm">
          <div className="flex gap-1 items-center">
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value: any) => table.setPageSize(value as number)}
            >
              <SelectTrigger className="pt-1 pb-0 px-2 focus:ring-0">
                <SelectValue className="placeholder:text-sm placeholder:text-gray-200 text-gray-700" />
              </SelectTrigger>
              <SelectContent className="max-h-64 hide-scrollbar overflow-auto">
                {[10, 20, 50, 100, 200, 500, 1000].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>rows</span>
          </div>
          {/* <span className="bg-gray-200 p-2 rounded">{data.length} rows</span> */}
          <div className="flex gap-1">
            <span>{data.length}</span>
            <span>records</span>
          </div>
        </div>
      </div>
      <div className="rounded-md border min-w-max">
        <Table className="min-w-max">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                style={rowStyle}
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
                  style={rowStyle}
                  className="max-w-full grid grid-cols-[auto_1.5fr_repeat(8,_minmax(0,_1fr))]  gap-2"
                  key={row.id}
                  // data-state={row?.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-4 px-1 text-gray-600 text-sm font-medium"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
      <div className="flex items-center justify-center gap-4 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="text-gray-700 disabled:text-gray-300 !p-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={9}
            height={14}
            viewBox="0 0 9 14"
            fill="none"
          >
            <path
              d="M7.5 13L1.5 7L7.5 1"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <div className="flex items-center gap-2 text-gray-500 font-medium w-max text-sm">
          <span>Page</span>
          <Select
            value={table.getState().pagination.pageIndex.toString()}
            onValueChange={(value: any) => table.setPageIndex(value as number)}
          >
            <SelectTrigger className="pt-1 pb-0 px-2">
              <SelectValue className="placeholder:text-sm placeholder:text-gray-200 text-gray-700" />
            </SelectTrigger>
            <SelectContent className="max-h-64 hide-scrollbar overflow-auto">
              {table.getPageOptions().map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>of</span>
          <span>{table.getPageCount()}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="text-gray-700 disabled:text-gray-300 !p-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M8.5 6L14.5 12L8.5 18"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        <div className="flex gap-2 items-center font-medium text-gray-700 text-sm">
          <div className="flex gap-1 items-center">
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value: any) => table.setPageSize(value as number)}
            >
              <SelectTrigger className="pt-1 pb-0 px-2 focus:ring-0">
                <SelectValue className="placeholder:text-sm placeholder:text-gray-200 text-gray-700" />
              </SelectTrigger>
              <SelectContent className="max-h-64 hide-scrollbar overflow-auto">
                {[10, 20, 50, 100, 200, 500, 1000].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>rows</span>
          </div>
          {/* <span className="bg-gray-200 p-2 rounded">{data.length} rows</span> */}
          <div className="flex gap-1">
            <span>{data.length}</span>
            <span>records</span>
          </div>
        </div>
      </div>
    </div>
  );
}
