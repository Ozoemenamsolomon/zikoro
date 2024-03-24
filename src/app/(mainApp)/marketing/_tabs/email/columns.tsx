"use client";
import { TSentEmail } from "@/types/marketing";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TSentEmail>[] = [
  {
    accessorKey: "emailCategory",
    header: "Campaign Name",
  },

  {
    accessorKey: "subject",
    header: "Subject",
  },
  {
    accessorKey: "emailBody",
    header: "Body",
  },
  {
    accessorKey: "created_at",
    header: "Sent On",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));

      const dateOptions: Intl.DateTimeFormatOptions = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      };

      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };

      const formattedDate = date.toLocaleDateString("en-US", dateOptions);
      const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

      return `${formattedDate}, ${formattedTime}`;
    },
  },
  {
    accessorKey: "emailRecipient",
    header: "Recipient",
    cell: ({ row }) => row.original.emailRecipient.length,
  },
];
