"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TAffiliateLink } from "@/types/marketing";
import { convertDateFormat } from "@/utils/date";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<TAffiliateLink>[] = [
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
    accessorKey: "affiliateEmail",
    header: "Affilate Email",
  },
  {
    header: "Registrations",
    accessorFn: (row) =>
      row.eventTransactions
        ? row.eventTransactions.reduce((acc, curr) => acc + curr.attendees, 0)
        : 0,
  },
  {
    header: "Paid Attendees",
    accessorFn: (row) =>
      row.eventTransactions
        ? row.eventTransactions
            .filter(
              ({ amountPaid, registrationCompleted }) =>
                amountPaid > 0 && registrationCompleted
            )
            .reduce((acc, curr) => acc + curr.attendees, 0)
        : 0,
  },
  // {
  //   header: "Commission rate",
  //   accessorFn: (row) =>
  //     (row.commissionType === "fixed"
  //       ? row.commissionValue
  //       : (row.commissionValue *
  //         0.01 *
  //         (row.eventTransactions
  //           ? row.eventTransactions
  //             .filter(
  //               ({ amountPaid, registrationCompleted }) =>
  //                 amountPaid > 0 && registrationCompleted
  //             )
  //             .reduce((acc, curr) => acc + curr.amountPaid, 0)
  //           : 0)) /
  //       (row.eventTransactions
  //         ? row.eventTransactions.reduce(
  //           (acc, curr) => acc + curr.attendees,
  //           0
  //         )
  //         : 1)
  //     ).toFixed(2),
  // },
  {
    header: "Earned Commission",
    accessorFn: (row) =>
      row.commissionType === "fixed"
        ? row.commissionValue * row.eventTransactions?.length
        : row.commissionValue *
          0.01 *
          (row.eventTransactions
            ? row.eventTransactions
                .filter(
                  ({ amountPaid, registrationCompleted }) =>
                    amountPaid > 0 && registrationCompleted
                )
                .reduce((acc, curr) => acc + curr.amountPaid, 0)
            : 0),
  },
  {
    header: "Revenue",
    accessorFn: (row) =>
      row.eventTransactions
        ? row.eventTransactions
            .filter(
              ({ amountPaid, registrationCompleted }) =>
                amountPaid > 0 && registrationCompleted
            )
            .reduce((acc, curr) => acc + curr.amountPaid, 0)
        : 0,
  },
  // {
  //   accessorKey: "created_at",
  //   header: "Date Created",
  //   cell: ({ row }) => (
  //     <div>{convertDateFormat(row.getValue("created_at"))}</div>
  //   ),
  // },
  // {
  //   accessorKey: "payoutSchedule",
  //   header: "Payment Schedule"
  // },
  {
    id: "details",
    header: "Details",
    cell: ({ row }) => (
      <Link
        className="text-basePrimary"
        href={`/affiliates/link/${row.original.id}/transactions/details`}
      >
        Details
      </Link>
    ),
  },
];
