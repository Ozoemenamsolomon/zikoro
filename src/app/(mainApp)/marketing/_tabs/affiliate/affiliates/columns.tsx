"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  useGetAffiliates,
  useUpdateAffiliate,
} from "@/hooks/services/marketing";
import { TAffiliate } from "@/types/marketing";
import { convertDateFormat } from "@/utils/date";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TAffiliate>[] = [
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
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastname",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="truncate overflow-hidden max-w-full">{row.original.email}</div>
    ),
  },
  {
    accessorKey: "accountDetails",
    header: "Account Details",
    cell: ({ row }) => {
      const accountDetails = row.original.accountDetails;

      if (!accountDetails) return <div>N/A</div>;

      return (
        <div className="space-y-1">
          <span className="text-xs font-medium text-gray-500">
            {accountDetails?.accountNumber || "N/A"}
            <div className="text-gray-500 flex no-wrap">
              <span className="flex-[70%] truncate">
                {accountDetails?.accountName || "N/A"}
              </span>
              <span className="flex-[30%]">
                | {accountDetails?.currency || "N/A"}
              </span>
            </div>
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "affliateCode",
    header: "Affiliate Code",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.affliateStatus;
      const affiliateId = row.original.id;

      console.log(affiliateId, status);

      const { updateAffiliate, isLoading } = useUpdateAffiliate({
        affiliateId: affiliateId as number,
      });

      const { getAffiliates, isLoading: affiliatesIsLoading } =
        useGetAffiliates();

      const updateAffiliateStatus = async (affliateStatus: boolean) => {
        await updateAffiliate({ payload: { affliateStatus } });
        await getAffiliates();
      };

      return (
        <Switch
          defaultChecked={status}
          onCheckedChange={updateAffiliateStatus}
          disabled={isLoading || affiliatesIsLoading}
          className="data-[state=checked]:bg-basePrimary"
        />
      );
    },
  },
];
