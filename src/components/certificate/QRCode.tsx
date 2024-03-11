import { useNode } from "@craftjs/core";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import Draggable, {
  ControlPosition,
  DraggableEventHandler,
} from "react-draggable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import QRCode from "react-qr-code";

export interface QRCodeProps {
  size?: number;
  url: string;
  pageX?: number;
  pageY?: number;
  color?: string;
}

const CertificateQRCode = ({ url, pageX, pageY, size, color }: QRCodeProps) => {
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
            fgColor={color}
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
    color
  } = useNode((node) => ({
    url: node.data.props.url,
    size: node.data.props.size,
    color: node.data.props.color,
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
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <svg
                width={16}
                height={16}
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.877075 7.49985C0.877075 3.84216 3.84222 0.877014 7.49991 0.877014C11.1576 0.877014 14.1227 3.84216 14.1227 7.49985C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49985ZM3.78135 3.21565C4.68298 2.43239 5.83429 1.92904 7.09998 1.84089V6.53429L3.78135 3.21565ZM3.21567 3.78134C2.43242 4.68298 1.92909 5.83428 1.84095 7.09997H6.5343L3.21567 3.78134ZM6.5343 7.89997H1.84097C1.92916 9.16562 2.43253 10.3169 3.21579 11.2185L6.5343 7.89997ZM3.78149 11.7842C4.6831 12.5673 5.83435 13.0707 7.09998 13.1588V8.46566L3.78149 11.7842ZM7.89998 8.46566V13.1588C9.16559 13.0706 10.3168 12.5673 11.2184 11.7841L7.89998 8.46566ZM11.7841 11.2184C12.5673 10.3168 13.0707 9.16558 13.1588 7.89997H8.46567L11.7841 11.2184ZM8.46567 7.09997H13.1589C13.0707 5.83432 12.5674 4.68305 11.7842 3.78143L8.46567 7.09997ZM11.2185 3.21573C10.3169 2.43246 9.16565 1.92909 7.89998 1.8409V6.53429L11.2185 3.21573Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-4">
            <HexColorPicker
              color={color}
              onChange={(color) =>
                setProp((props: QRCodeProps) => (props.color = color), 1000)
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const QRCodeDefaultProps: QRCodeProps = {
  url: "",
  size: 64,
  color: "#00000"
};

CertificateQRCode.craft = {
  props: QRCodeDefaultProps,
  related: {
    settings: QRCodeSettings,
  },
};

export default CertificateQRCode;
