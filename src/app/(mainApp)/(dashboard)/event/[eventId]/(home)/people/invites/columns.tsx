"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutateData } from "@/hooks/services/request";
import { cn } from "@/lib";
import { TAttendeeInvites } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { format, add, isAfter } from "date-fns";
import Link from "next/link";

const getResponseStyles = (response: string): string => {
  const styles = {
    attending: "bg-green-100 text-green-600 border-green-600",
    pending: "bg-yellow-100 text-yellow-600 border-yellow-600",
    "not attending": "bg-red-100 text-red-600 border-red-600",
    default: "bg-gray-100 text-gray-600 border-gray-600",
  };
  return styles[response] || styles.default;
};

export const columns: (
  getEmailInvites: () => Promise<void>
) => ColumnDef<TAttendeeInvites>[] = (getEmailInvites) => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-2">
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
      <div className="px-2">
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
    id: "inviteeInfo",
    header: "Invitee Info",
    cell: ({ row }) => (
      <div className="space-y-1">
        <span className="text-sm font-medium text-gray-700 truncate block">
          {row.original.name}
        </span>
        <span className="truncate text-gray-500 block text-xs">
          {row.original.email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <span className="capitalize">{row.original.role}</span>,
  },
  {
    accessorKey: "response",
    header: "Status",
    cell: ({ row }) => {
      const response = row.original.response?.toLowerCase();
      const responseStyles = getResponseStyles(response);

      return (
        <div
          className={cn(
            "max-w-full truncate p-1 border rounded w-fit text-sm capitalize",
            responseStyles
          )}
        >
          {response === "pending" ? "Awaiting Response" : response || "N/A"}
        </div>
      );
    },
  },
  {
    id: "dates",
    header: "Dates",
    cell: ({ row }) => (
      <div className="flex flex-col text-tiny text-gray-700">
        {row.original.created_at && (
          <span>
            First Sent on: <b>{format(row.original.created_at, "PPP")}</b>
          </span>
        )}
        {row.original.lastResendAt && (
          <span>
            Last sent on: <b>{format(row.original.lastResendAt, "PPP")}</b>
          </span>
        )}
        {row.original.responseDate && (
          <span>
            Responded on: <b>{format(row.original.responseDate, "PPP")}</b>
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "guests",
    header: "Guests",
    cell: ({ row }) => {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <button
              className={cn(
                "text-sky-500 underline",
                (!row.original.guests || !row.original.guests.length) &&
                  "hidden"
              )}
            >
              View Guests ({row.original.guests && row.original.guests.length})
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>Guests</DialogHeader>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b capitalize font-medium text-gray-600">
                    Name
                  </th>
                  <th className="py-2 px-4 border-b capitalize font-medium text-gray-600">
                    Email
                  </th>
                  <th className="py-2 px-4 border-b capitalize font-medium text-gray-600">
                    Info
                  </th>
                </tr>
              </thead>
              <tbody>
                {row.original.guests &&
                  row.original.guests.map(
                    ({ firstName, lastName, email, attendeeAlias }) => (
                      <tr>
                        <td className="py-2 px-4 border-b text-gray-500">
                          {firstName + " " + lastName}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-500">
                          {email}
                        </td>
                        <td className="py-2 px-4 border-b text-gray-500">
                          <Link href={`all?attendeeAlias=${attendeeAlias}`}>
                            <span className={cn("text-sky-500 underline")}>
                              View
                            </span>
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </DialogContent>
        </Dialog>
      );
    },
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

      if (response !== "pending") return <div />;

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
          disabled={
            isLoading || (lastResendAt && !isAtLeast24HoursAfter(lastResendAt))
          }
          onClick={resendInvite}
          className="bg-basePrimary flex gap-2 px-4 text-white mx-2"
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
