"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib";
import { TAttendeeInvites } from "@/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TAttendeeInvites>[] = [
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "method",
    header: "Method",
  },
  {
    accessorKey: "trackingId",
    header: "Tracking ID",
  },
  {
    accessorKey: "response",
    header: "Status",
    cell: ({ row }) => {
      const response = row.original.response?.toLowerCase();

      return (
        <div
          className={cn(
            "max-w-full truncate p-1 border rounded w-fit text-sm capitalize",
            response === "attending"
              ? "bg-green-100 text-green-600 border-green-600"
              : response === "pending"
              ? "bg-yellow-100 text-yellow-600 border-yellow-600"
              : response === "not attending"
              ? "bg-red-100 text-red-600 border-red-600"
              : "bg-gray-100 text-gray-600 border-gray-600"
          )}
        >
          {response || "N/A"}
        </div>
      );
    },
  },
];
