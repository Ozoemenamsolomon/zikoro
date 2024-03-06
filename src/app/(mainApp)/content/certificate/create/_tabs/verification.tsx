import { Switch } from "@/components/ui/switch";
import React from "react";
import { TabProps } from "../page";
import { useEditor } from "@craftjs/core";
import CertificateQRCode from "@/components/certificate/QRCode";
import { Text } from "@/components/certificate";

const Verification = ({ details, setValue }: TabProps) => {
  const { connectors } = useEditor();

  return (
    <>
      <div className="space-y-4">
        <button
          ref={(ref) =>
            ref && connectors.create(ref, <CertificateQRCode url="this" />)
          }
          className="text-sky-300 text-sm"
          data-cy="toolbox-qr-code"
        >
          Drag to add QR code
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text text={"Certificate ID: #{certificateId#}"} />
            )
          }
          className="text-sky-300 text-sm"
          data-cy="toolbox-qr-code"
        >
          Drag to add Certificate Id
        </button>
      </div>
    </>
  );
};

export default Verification;
