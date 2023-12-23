"use client";
import { ColumnDef } from "@tanstack/react-table";

type TBilling = {
  event: string;
  payerId: string;
  relNo: string;
  transDate: string;
  attendees: number;
  currency: string;
  amount: number;
  payoutDate: string;
  status: string;
};

export const columns: ColumnDef<TBilling>[] = [
  {
    accessorKey: "event",
    header: "Event",
  },
  {
    accessorKey: "payerId",
    header: "Payer ID",
  },
  {
    accessorKey: "relNo",
    header: "Relationship Number",
  },
  {
    accessorKey: "transDate",
    header: "Transaction Date",
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
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "payoutDate",
    header: "Payout Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
