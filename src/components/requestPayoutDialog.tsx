import { TEventTransaction } from "@/types/billing";
import React from "react";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRequestPayOut } from "@/hooks/services/billing";

interface RequestPayoutDialogProps {
  selectedRows: TEventTransaction[];
  getEventTransactions: () => Promise<void>;
}

const RequestPayoutDialog = ({
  selectedRows,
  getEventTransactions,
}: RequestPayoutDialogProps) => {
  const totalRevenue = selectedRows.reduce(
    (acc, { amountPaid }) => amountPaid + acc,
    0
  );

  const { requestPayOut } = useRequestPayOut({ userId: 1 });

  const onRequestPayOut = async () => {
    const payload = selectedRows.map(({ id }) => id);
    await requestPayOut({ payload });
    await getEventTransactions();
  };

  return (
    <div className="space-y-4">
      <span className="text-sm text-gray-700">
        You've requested payout for {selectedRows.length} transactions
      </span>
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 grid grid-cols-3">
              <th className="py-2 px-4 border-b capitalize text-xs font-medium text-gray-600">
                User Email
              </th>
              <th className="py-2 px-4 border-b capitalize text-xs font-medium text-gray-600">
                Attendee
              </th>
              <th className="py-2 px-4 border-b capitalize text-xs font-medium text-gray-600">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedRows.map((row, index) => (
              <tr key={row.id} className="grid grid-cols-3">
                <td className="py-2 px-4 border-b text-gray-500 text-tiny text-center">
                  {row.userEmail}
                </td>
                <td className="py-2 px-4 border-b text-gray-500 text-tiny text-center">
                  {row.attendees}
                </td>
                <td className="py-2 px-4 border-b text-gray-500 text-tiny text-center">
                  {row.amountPaid}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-2">
        <div className="border">
          <div className="flex justify-between p-4 border-b">
            <span className="text-gray-700 text-sm">Total Payout</span>
            <span className="text-gray-800 font-semibold">
              ₦{new Intl.NumberFormat().format(totalRevenue)}
            </span>
          </div>
          <div className="flex justify-between p-4">
            <span className="text-gray-700 text-sm">Beneficiary</span>
            <div className="flex flex-col space-y-1">
              <span className="text-gray-700 font-medium text-sm">
                ACCESS BANK
              </span>
              <span className="text-gray-700 text-xs">****9876</span>
            </div>
          </div>
        </div>
        <span className="text-tiny text-gray-700">
          All payouts will be reviewed. Payment could be delayed or stopped if
          issues are identified.
        </span>
      </div>
      <DialogClose asChild>
        <Button className="bg-basePrimary w-full" onClick={onRequestPayOut}>
          Request Payout
        </Button>
      </DialogClose>
    </div>
  );
};

export default RequestPayoutDialog;
