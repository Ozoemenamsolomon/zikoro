"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { TEventTransaction } from "@/types/billing";
import { convertDateFormat } from "@/utils/date";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TEventTransaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "event",
    header: "Event",
  },
  {
    accessorKey: "userId",
    header: "user ID",

    cell: ({ row }) => <div className="truncate">{row.getValue("userId")}</div>,
  },
  {
    accessorKey: "transactionReference",
    header: "Reference",
    cell: ({ row }) => (
      <div className="truncate">{row.getValue("transactionReference")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Trans. Date",
    cell: ({ row }) => (
      <div className="max-w-full truncate">
        {convertDateFormat(row.getValue("created_at"))}
      </div>
    ),
  },
  {
    accessorKey: "attendees",
    header: "Attendees",
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "amountPaid",
    header: "Amount",
  },
  {
    accessorKey: "payOutDate",
    header: "Payout Date",
    cell: ({ row }) => (
      <div className="max-w-full truncate">
        {row.getValue("payOutDate")
          ? convertDateFormat(row.getValue("payOutDate"))
          : "------"}
      </div>
    ),
  },
  {
    accessorKey: "PaidStatus",
    header: "Status",
  },
];
