"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutateData } from "@/hooks/services/request";
import { cn } from "@/lib";
import { TAttendeeInvites } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format, add, isAfter } from "date-fns";

export const columns: (
  getEmailInvites: () => Promise<void>
) => ColumnDef<TAttendeeInvites>[] = (getEmailInvites) => [
  {
    id: "select",
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
    accessorKey: "name",
    cell: ({ row }) => (
      <span className="text-gray-800 capitalize">{row.original.name}</span>
    ),
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
          {response === "pending" ? "Awaiting Response" : response || "N/A"}
        </div>
      );
    },
  },
  {
    id: "created_at",
    header: "First Invite",
    accessorFn: (row) =>
      row.created_at ? format(row.created_at, "PPP") : "N/A",
  },
  {
    id: "responseDate",
    header: "Response Date",
    accessorFn: (row) =>
      row.responseDate ? format(row.responseDate, "PPP") : "N/A",
  },
  {
    id: "lastResendAt",
    header: "Last Sent",
    accessorFn: (row) =>
      row.lastResendAt ? format(row.lastResendAt, "PPP") : "N/A",
  },
  {
    id: "resend",
    header: "Resend",
    cell: ({ row }) => {
      const { mutateData, isLoading } = useMutateData(
        "/attendees/invites/resend?trackingId=" + row.original.trackingId
      );

      const response = row.original.response;
      const lastResendAt = row.original.lastResendAt;

      if (response !== "pending") return;

      const resendInvite = async () => {
        await mutateData({
          payload: {
            email: row.original.email,
            eventAlias: row.original.eventAlias,
          },
        });
        await getEmailInvites();
      };

      const isAtLeast24HoursAfter = (date: Date): boolean =>
        isAfter(new Date(), add(date, { hours: 24 }));

      return (
        <Button
          // disabled={
          //   isLoading
          //   // || (lastResendAt && !isAtLeast24HoursAfter(lastResendAt))
          // }
          onClick={resendInvite}
          className="bg-basePrimary flex gap-2 px-4 text-white"
        >
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth={2}
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </Button>
      );
    },
  },
];
