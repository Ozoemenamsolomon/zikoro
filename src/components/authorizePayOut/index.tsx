import { IPayOut, TOrganization } from "@/types";
import React, { useState } from "react";
import IntializePayOut from "./IntializePayOut";
import TransferOTP from "./transferOTP";

const AuthorizePayOutDialog = ({
  organization,
  payoutInfo,
  defaultStep,
  isRetry,
}: {
  organization: TOrganization;
  payoutInfo: IPayOut;
  defaultStep: number;
  isRetry: boolean;
}) => {
  const [step, setStep] = useState<number>(defaultStep);
  const [transferCode, setTransferCode] = useState<string>(
    payoutInfo.transferCode
  );

  if (step === 1)
    return (
      <IntializePayOut
        setStep={setStep}
        organization={organization}
        payoutInfo={payoutInfo}
        setTransferCode={setTransferCode}
      />
    );

  if (step === 2)
    return (
      <TransferOTP
        transferCode={transferCode}
        setStep={setStep}
        payOutRef={payoutInfo.payOutRef}
        isRetry={isRetry}
      />
    );
};

export default AuthorizePayOutDialog;
