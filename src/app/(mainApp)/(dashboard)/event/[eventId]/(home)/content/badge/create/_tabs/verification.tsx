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
      <div className="space-y-4 capitalize">
        <button
          ref={(ref) =>
            ref && connectors.create(ref, <CertificateQRCode url="this" />)
          }
          className={"bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"}
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
                text={"Certificate ID: #{_id#}"}
                isBold
                isItalic
                isNotEditable
              />
            )
          }
          className={"bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add Certificate Id
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
          className={"bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add attendee name
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text text={"#{first_name#}"} isBold isItalic isNotEditable />
            )
          }
          className={"bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add attendee first name
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text text={"#{last_name#}"} isBold isItalic isNotEditable />
            )
          }
          className={"bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add attendee last name
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text text={"#{profession#}"} isBold isItalic isNotEditable />
            )
          }
          className={"bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add profession
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text text={"#{attendee_role#}"} isBold isItalic isNotEditable />
            )
          }
          className={"bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add attendee role
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text text={"#{event_name#}"} isBold isItalic isNotEditable />
            )
          }
          className={"bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add event name
        </button>
        <button
          ref={(ref) =>
            ref &&
            connectors.create(
              ref,
              <Text
                text={"#{organization_name#}"}
                isBold
                isItalic
                isNotEditable
              />
            )
          }
          className={"bg-basePrimary/20 border-basePrimary py-3 px-2 rounded text-basePrimary w-full border"}
          data-cy="toolbox-qr-code"
        >
          Drag to add organization name
        </button>
      </div>
    </>
  );
};

export default Verification;
