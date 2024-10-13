"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { IPayOut } from "@/types/billing";
import { convertDateFormat } from "@/utils/date";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AuthorizePayOutDialog from "@/components/authorizePayOut";
import useUserStore from "@/store/globalUserStore";

export const columns: ColumnDef<IPayOut>[] = [
  // {
  //   accessorKey: "select",
  //   header: ({ table }) => (
  //     <div className="pl-2">
  //       <Checkbox
  //         className="data-[state=checked]:bg-basePrimary"
  //         checked={
  //           table.getIsAllPageRowsSelected() ||
  //           (table.getIsSomePageRowsSelected() && "indeterminate")
  //         }
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="pl-2">
  //       <Checkbox
  //         className="data-[state=checked]:bg-basePrimary"
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //         disabled={!row.getCanSelect()}
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "requestedBy",
    header: "Requested by",

    cell: ({ row }) => {
      const user = row.original.user;

      if (!user) return <div>N/A</div>;

      return (
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-600">
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
    accessorKey: "requestedFor",
    header: "Requested for",

    cell: ({ row }) => {
      const organization = row.original.organization;

      if (!organization) return <div>N/A</div>;

      return (
        <div className="space-y-1">
          <span className="text-sm font-medium text-gray-600">
            {organization.organizationName}
            <div className="text-gray-500 flex no-wrap">
              <span className="flex-[70%] truncate">
                {organization.eventContactEmail || "N/A"}
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
        {row.getValue("paidAt")
          ? convertDateFormat(row.getValue("paidAt"))
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
              ? "bg-amber-100 text-amber-600 border-amber-600"
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
  {
    id: "pay out",
    header: "Action",
    cell: ({ row }) => {
      const organization = row.original.organization;
      const payoutInfo = row.original;
      const requestedBy = row.original.user;
      const { user, setUser } = useUserStore();

      console.log(user, "user");

      // if (payoutInfo.payOutStatus !== "requested") return;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <button
              disabled={!organization.payoutAccountDetails}
              className="text-basePrimary underline"
            >
              <span>Pay Out</span>
            </button>
          </DialogTrigger>
          <DialogContent className="px-3">
            <DialogHeader>
              <DialogTitle>
                <span className="capitalize">Authorize Pay Out</span>
              </DialogTitle>
            </DialogHeader>
            <AuthorizePayOutDialog
              payoutInfo={payoutInfo}
              organization={organization}
              defaultStep={payoutInfo.payOutStatus !== "requested" ? 2 : 1}
              isRetry={payoutInfo.payOutStatus !== "requested" ? true : false}
              requestedBy={requestedBy}
            />
          </DialogContent>
        </Dialog>
      );
    },
  },
];
