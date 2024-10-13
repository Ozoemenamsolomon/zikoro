import { IPayOut, TOrganization } from "@/types";
import React from "react";
import { DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { useInitializePayOut } from "@/hooks/services/payout";

const IntializePayOut = ({
  organization,
  payoutInfo,
  setStep,
  setTransferCode,
}: {
  organization: TOrganization;
  payoutInfo: IPayOut;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setTransferCode: React.Dispatch<React.SetStateAction<string>>;
}) => {
  console.log(organization);

  const { initializePayOut, isLoading } = useInitializePayOut();

  const onAuthorizePayOut = async () => {
    if (!organization.payoutAccountDetails) return;

    const { status, transferCode } = await initializePayOut({
      payload: {
        accountDetails: organization.payoutAccountDetails,
        amount: payoutInfo.Amount,
        reference: payoutInfo.payOutRef,
      },
    });

    if (!status || !transferCode) return;

    setTransferCode(transferCode);

    setStep(2);

    console.log(status, transferCode);

    console.log(organization.payoutAccountDetails, "payout");
  };
  return (
    <div className="space-y-4">
      <div className="border border-gray-200">
        <div className="grid grid-cols-2 border-b border-b-200">
          <div className="bg-gray-50 border-r border-r-200 pl-2 py-2 text-gray-700 font-medium">
            Bank Name
          </div>
          <div className="pl-2 py-2 font-medium text-gray-500">
            {organization.payoutAccountDetails?.bankName}
          </div>
        </div>
        <div className="grid grid-cols-2 border-b border-b-200">
          <div className="bg-gray-50 border-r border-r-200 pl-2 py-2 text-gray-700 font-medium">
            Bank Country
          </div>
          <div className="pl-2 py-2 font-medium text-gray-500">
            {organization.payoutAccountDetails?.bankCountry}
          </div>
        </div>
        <div className="grid grid-cols-2 border-b border-b-200">
          <div className="bg-gray-50 border-r border-r-200 pl-2 py-2 text-gray-700 font-medium">
            Account Name
          </div>
          <div className="pl-2 py-2 font-medium text-gray-500">
            {organization.payoutAccountDetails?.accountName}
          </div>
        </div>
        <div className="grid grid-cols-2 border-b border-b-200">
          <div className="bg-gray-50 border-r border-r-200 pl-2 py-2 text-gray-700 font-medium">
            Account Number
          </div>
          <div className="pl-2 py-2 font-medium text-gray-500">
            {organization.payoutAccountDetails?.accountNumber}
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div className="bg-gray-50 border-r border-r-200 pl-2 py-2 text-gray-700 font-medium">
            Amount
          </div>
          <div className="pl-2 py-2 font-medium text-gray-500">
            {new Intl.NumberFormat().format(payoutInfo.Amount)}
          </div>
        </div>
      </div>
      <Button className="bg-basePrimary w-full" onClick={onAuthorizePayOut}>
        Authorize Payout
      </Button>
    </div>
  );
};

export default IntializePayOut;
