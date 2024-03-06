import { useNode } from "@craftjs/core";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import Draggable, {
  ControlPosition,
  DraggableEventHandler,
} from "react-draggable";
import { Resizable } from "re-resizable";
import QRCode from "react-qr-code";

export interface QRCodeProps {
  size?: number;
  url: string;
  pageX?: number;
  pageY?: number;
}

const CertificateQRCode = ({ url, pageX, pageY, size }: QRCodeProps) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

  const [startingPos, setStartingPos] = useState<ControlPosition>({
    x: pageX || 0,
    y: pageY || 0,
  });

  const handleStop: DraggableEventHandler = (e, data) => {
    setStartingPos({ x: data.x, y: data.y });
    setProp((prop: QRCodeProps) => {
      prop.pageX = data.x;
      prop.pageY = data.y;
    }, 500);
  };

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (selected) {
      return;
    }

    setEditable(false);
  }, [selected]);

  return (
    <Draggable onStop={handleStop} position={startingPos}>
      <div
        ref={(ref) => ref && connect(ref)}
        onClick={() => selected && setEditable(true)}
        className="cursor-move w-fit h-fit"
      >
        <div
          style={{ width: size + "px", height: "auto" }}
          className={cn(selected && "border-2 border-sky-400")}
        >
          <QRCode
            size={256}
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%",
            }}
            value={url}
            viewBox={`0 0 256 256`}
          />
        </div>
      </div>
    </Draggable>
  );
};

const QRCodeSettings = () => {
  const {
    actions: { setProp },
    url,
    size,
  } = useNode((node) => ({
    url: node.data.props.url,
    size: node.data.props.size,
  }));

  return (
    <div className="flex gap-2 justify-end">
      <div className="w-fit rounded-md bg-background text-sm relative border flex items-center">
        <span className="px-2 border-r py-1 flex justify-center items-center">
          <svg
            width={16}
            height={16}
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5 3.04999C11.7485 3.04999 11.95 3.25146 11.95 3.49999V7.49999C11.95 7.74852 11.7485 7.94999 11.5 7.94999C11.2515 7.94999 11.05 7.74852 11.05 7.49999V4.58639L4.58638 11.05H7.49999C7.74852 11.05 7.94999 11.2515 7.94999 11.5C7.94999 11.7485 7.74852 11.95 7.49999 11.95L3.49999 11.95C3.38064 11.95 3.26618 11.9026 3.18179 11.8182C3.0974 11.7338 3.04999 11.6193 3.04999 11.5L3.04999 7.49999C3.04999 7.25146 3.25146 7.04999 3.49999 7.04999C3.74852 7.04999 3.94999 7.25146 3.94999 7.49999L3.94999 10.4136L10.4136 3.94999L7.49999 3.94999C7.25146 3.94999 7.04999 3.74852 7.04999 3.49999C7.04999 3.25146 7.25146 3.04999 7.49999 3.04999L11.5 3.04999Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <Input
          type="number"
          max={256}
          className="p-1.5 w-[50px] placeholder:text-sm placeholder:text-gray-200 text-gray-700 border-0"
          onInput={(e) => {
            setProp(
              (props: QRCodeProps) =>
                (props.size = parseInt(e.currentTarget.value) || 0),
              500
            );
          }}
          value={size}
        />
      </div>
    </div>
  );
};

export const QRCodeDefaultProps: QRCodeProps = {
  url: "",
  size: 64,
};

CertificateQRCode.craft = {
  props: QRCodeDefaultProps,
  related: {
    settings: QRCodeSettings,
  },
};

export default CertificateQRCode;
