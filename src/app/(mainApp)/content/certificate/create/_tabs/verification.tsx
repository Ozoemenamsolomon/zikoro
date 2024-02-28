import { Switch } from "@/components/ui/switch";
import React from "react";
import { TabProps } from "../page";

const Verification = ({ details, setValue }: TabProps) => {

  return <>
    <div className="space-y-4">
      <div className="pb-2 flex justify-between items-center">
        <label className="text-lg font-medium text-gray-700">
          Certificate ID
        </label>
        <Switch className="data-[state=checked]:bg-basePrimary" checked={details.verification.showId}
          onCheckedChange={(status) => setValue("verification", { ...details.verification, showId: status })} />
      </div>
      <div className="pb-2 flex justify-between items-center">
        <label className="text-lg font-medium text-gray-700">
          QR Code
        </label>
        <Switch className="data-[state=checked]:bg-basePrimary" checked={details.verification.showQRCode}
          onCheckedChange={(status) => setValue("verification", { ...details.verification, showQRCode: status })} />
      </div>
      <div className="pb-2 flex justify-between items-center">
        <label className="text-lg font-medium text-gray-700">
          Verification URL
        </label>
        <Switch className="data-[state=checked]:bg-basePrimary" checked={details.verification.showURL}
          onCheckedChange={(status) => setValue("verification", { ...details.verification, showURL: status })} />
      </div>
    </div>
  </>;
};

export default Verification;

