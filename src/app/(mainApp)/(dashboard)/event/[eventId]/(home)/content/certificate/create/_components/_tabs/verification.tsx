import React from "react";
import { TabProps } from "../page";
import { useEditor } from "@craftjs/core";
import CertificateQRCode from "@/components/certificate/QRCode";
import { Text } from "@/components/certificate";

const Verification = ({ details, setValue }: TabProps) => {
  const { connectors } = useEditor();
  const url = "https://zikoro.com/credentials/verify/certificate/#{certificate_id#}";

  return (
    <>
      <div className="space-y-4">
        <button
          ref={(ref) =>
            ref && connectors.create(ref, <CertificateQRCode url={url} />)
          }
          className={"bg-gray-50 py-3 px-2 rounded text-gray-800 w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add QR code
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text
                text={"Certificate ID: #{certificate_id#}"}
                isBold
                isItalic
                isNotEditable
              />
            )
          }
          className={"bg-gray-50 py-3 px-2 rounded text-gray-800 w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add Certificate Id
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text text={"#{first_name#}"} isBold isItalic isNotEditable />
            )
          }
          className={"bg-gray-50 py-3 px-2 rounded text-gray-800 w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add Attendee First Name
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text text={"#{last_name#}"} isBold isItalic isNotEditable />
            )
          }
          className={"bg-gray-50 py-3 px-2 rounded text-gray-800 w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add Attendee Last Name
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text
                text={"#{first_name#} #{last_name#}"}
                isBold
                isItalic
                isNotEditable
              />
            )
          }
          className={"bg-gray-50 py-3 px-2 rounded text-gray-800 w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add Attendee Name
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text
                text={"www.zikoro.com/verify/#{certificate_id#}"}
                isBold
                isItalic
                isNotEditable
              />
            )
          }
          className={"bg-gray-50 py-3 px-2 rounded text-gray-800 w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add Verification URL
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text
                text={"#{city#} #{country#}"}
                isBold
                isItalic
                isNotEditable
              />
            )
          }
          className={"bg-gray-50 py-3 px-2 rounded text-gray-800 w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add location
        </button>
      </div>
    </>
  );
};

export default Verification;
