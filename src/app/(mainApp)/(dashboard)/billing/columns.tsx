"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { TEventTransaction } from "@/types/billing";
import { convertDateFormat } from "@/utils/date";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TEventTransaction>[] = [
  {
    accessorKey: "select",
    header: ({ table }) => (
      <div className="pl-2">
        <Checkbox
          className="data-[state=checked]:bg-basePrimary"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="pl-2">
        <Checkbox
          className="data-[state=checked]:bg-basePrimary"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={!row.getCanSelect()}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "event",
    header: "Event",
  },
  {
    accessorKey: "userEmail",
    header: "Paid by",

    cell: ({ row }) => (
      <div className="truncate">{row.getValue("userEmail")}</div>
    ),
  },
  {
    accessorKey: "eventRegistrationRef",
    header: "Reference",
    cell: ({ row }) => (
      <div className="truncate">{row.getValue("eventRegistrationRef")}</div>
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
    accessorKey: "eventPrice",
    header: "Ticket Price",
  },
  {
    accessorKey: "amountPaid",
    header: "Revenue",
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
    accessorKey: "registrationCompleted",
    header: "Reg. Status",
    cell: ({ row }) => {
      const regStatus = row.original.registrationCompleted;
      const amountPaid = row.original.amountPaid;
      return (
        <div
          className={`max-w-full truncate p-1 border ${
            regStatus
              ? amountPaid > 0
                ? "bg-green-100 text-green-600 border-green-600"
                : "bg-gray-100 text-gray-600 border-gray-600"
              : "bg-red-100 text-red-600 border-red-600"
          } rounded w-fit text-sm`}
        >
          {regStatus ? (amountPaid > 0 ? "Complete" : "Free") : "Incomplete"}
        </div>
      );
    },
  },
  {
    accessorKey: "payOutStatus",
    header: "PayOut Status",
    cell: ({ row }) => {
      const payOutStatus = row.original.payOutStatus?.toLowerCase();

      return (
        <div
          className={`max-w-full truncate p-1 border ${
            payOutStatus === "paid"
              ? "bg-green-100 text-green-600 border-green-600"
              : payOutStatus === "requested"
              ? "bg-yellow-100 text-yellow-600 border-yellow-600"
              : payOutStatus === "new"
              ? "bg-blue-100 text-blue-600 border-blue-600"
              : "bg-gray-100 text-gray-600 border-gray-600"
          } rounded w-fit text-sm capitalize`}
        >
          {payOutStatus || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "discountCode",
    header: "Discount Code",
  },
  {
    accessorKey: "affliateEmail",
    header: "Affiliate Email",
  },
  {
    accessorKey: "affliateCode",
    header: "Affiliate Code",
  },
  {
    accessorKey: "ticketCategory",
    header: "Ticket Category",
  },
];
