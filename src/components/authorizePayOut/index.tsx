import { IPayOut, TOrganization } from "@/types";
import React, { useState } from "react";
import IntializePayOut from "./IntializePayOut";
import TransferOTP from "./transferOTP";

const AuthorizePayOutDialog = ({
  organization,
  payoutInfo,
}: {
  organization: TOrganization;
  payoutInfo: IPayOut;
  getPayOuts: () => Promise<void>
}) => {
  const [step, setStep] = useState<number>(1);
  const [transferCode, setTransferCode] = useState<string>("");

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
      />
    );
};

export default AuthorizePayOutDialog;
