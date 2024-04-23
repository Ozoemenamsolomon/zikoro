"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { IPayOut } from "@/types/billing";
import { convertDateFormat } from "@/utils/date";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: ColumnDef<IPayOut>[] = [
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
    accessorKey: "requestedBy",
    header: "Requested by",

    cell: ({ row }) => {
      const user = row.original.users;

      if (!user) return <div>N/A</div>;

      return (
        <div className="space-y-1">
          <span className="text-xs font-medium text-gray-500">
            {user?.firstName + " " + user?.lastName}
            <div className="text-gray-500 flex no-wrap">
              <span className="flex-[70%] truncate">
                {user.userEmail || "N/A"}
              </span>
            </div>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "Amount",
    header: "amount",
  },
  {
    accessorKey: "payOutRef",
    header: "Reference",
    cell: ({ row }) => (
      <div className="truncate">{row.getValue("payOutRef")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Request Date",
    cell: ({ row }) => (
      <div className="max-w-full truncate">
        {convertDateFormat(row.getValue("created_at"))}
      </div>
    ),
  },
  {
    accessorKey: "paidAt",
    header: "Payout Date",
    cell: ({ row }) => (
      <div className="max-w-full truncate">
        {row.getValue("paidDate")
          ? convertDateFormat(row.getValue("paidDate"))
          : "------"}
      </div>
    ),
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
              : payOutStatus === "pending"
              ? "bg-blue-100 text-amber-600 border-amber-600"
              : payOutStatus === "failed"
              ? "bg-blue-100 text-red-600 border-red-600"
              : "bg-gray-100 text-gray-600 border-gray-600"
          } rounded w-fit text-sm capitalize`}
        >
          {payOutStatus || "N/A"}
        </div>
      );
    },
  },
];