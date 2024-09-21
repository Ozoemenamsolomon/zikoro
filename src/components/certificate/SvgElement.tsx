import { useNode } from "@craftjs/core";
import React, {
  useState,
  useEffect,
  SVGProps,
  SVGProps,
  ReactNode,
} from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import Draggable, {
  ControlPosition,
  DraggableEventHandler,
} from "react-draggable";
import { Resizable } from "re-resizable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HexColorPicker } from "react-colorful";
import { Button } from "@/components/ui/button";

export interface SvgProps {
  width?: number;
  height?: number;
  color?: string;
  pageX?: number;
  pageY?: number;
  Icon: ({ ...props }: SVGProps<SVGSVGElement>) => ReactNode;
}

const SvgElement = ({ width, height, color, pageX, pageY, Icon }: SvgProps) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (selected) {
      return;
    }

    setEditable(false);
  }, [selected]);

  const [startingPos, setStartingPos] = useState<ControlPosition>({
    x: pageX || 0,
    y: pageY || 0,
  });

  const handleStop: DraggableEventHandler = (e, data) => {
    setStartingPos({ x: data.x, y: data.y });
    setProp((prop: SvgProps) => {
      prop.pageX = data.x;
      prop.pageY = data.y;
    }, 500);
  };

  return (
    <Draggable onStop={handleStop} position={startingPos}>
      <div
        ref={(ref) => ref && connect(ref)}
        onClick={() => selected && setEditable(true)}
        className="cursor-move w-fit h-fit"
      >
        <div
          style={{ width: width + "px", height: height + "px", color }}
          className={cn(selected && "border-2 border-sky-400")}
        >
          <Icon
            width={width + "px"}
            height={height + "px"}
            fill={color}
            style={{
              width: width + "px",
              height: height + "px",
              color,
              background: color,
            }}
          />
        </div>
      </div>
    </Draggable>
  );
};

const SvgElementSettings = () => {
  const {
    actions: { setProp },
    color,
    height,
    width,
  } = useNode((node) => ({
    color: node.data.props.color,
    height: node.data.props.height,
    width: node.data.props.width,
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
              d="M7.1813 1.68179C7.35704 1.50605 7.64196 1.50605 7.8177 1.68179L10.3177 4.18179C10.4934 4.35753 10.4934 4.64245 10.3177 4.81819C10.142 4.99392 9.85704 4.99392 9.6813 4.81819L7.9495 3.08638L7.9495 11.9136L9.6813 10.1818C9.85704 10.0061 10.142 10.0061 10.3177 10.1818C10.4934 10.3575 10.4934 10.6424 10.3177 10.8182L7.8177 13.3182C7.73331 13.4026 7.61885 13.45 7.4995 13.45C7.38015 13.45 7.26569 13.4026 7.1813 13.3182L4.6813 10.8182C4.50557 10.6424 4.50557 10.3575 4.6813 10.1818C4.85704 10.0061 5.14196 10.0061 5.3177 10.1818L7.0495 11.9136L7.0495 3.08638L5.3177 4.81819C5.14196 4.99392 4.85704 4.99392 4.6813 4.81819C4.50557 4.64245 4.50557 4.35753 4.6813 4.18179L7.1813 1.68179Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <Input
          className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 w-[50px] border-0"
          onInput={(e) => {
            setProp(
              (props: SvgProps) =>
                (props.width = parseInt(e.currentTarget.value)),
              500
            );
          }}
          value={width}
        />
      </div>
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
              d="M4.81812 4.68161C4.99386 4.85734 4.99386 5.14227 4.81812 5.318L3.08632 7.0498H11.9135L10.1817 5.318C10.006 5.14227 10.006 4.85734 10.1817 4.68161C10.3575 4.50587 10.6424 4.50587 10.8181 4.68161L13.3181 7.18161C13.4939 7.35734 13.4939 7.64227 13.3181 7.818L10.8181 10.318C10.6424 10.4937 10.3575 10.4937 10.1817 10.318C10.006 10.1423 10.006 9.85734 10.1817 9.68161L11.9135 7.9498H3.08632L4.81812 9.68161C4.99386 9.85734 4.99386 10.1423 4.81812 10.318C4.64239 10.4937 4.35746 10.4937 4.18173 10.318L1.68173 7.818C1.50599 7.64227 1.50599 7.35734 1.68173 7.18161L4.18173 4.68161C4.35746 4.50587 4.64239 4.50587 4.81812 4.68161Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <Input
          className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 w-[50px] border-0"
          onInput={(e) => {
            setProp(
              (props: SvgProps) =>
                (props.height = parseInt(e.currentTarget.value)),
              500
            );
          }}
          value={height}
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
                setProp((props: SvgProps) => (props.color = color), 1000)
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const SvgElementDefaultProps: SvgProps = {
  color: "#000",
  width: 200,
  height: 200,
  pageX: 0,
  pageY: 0,
  Icon: ({ ...props }: SVGProps<SVGSVGElement>) => <div {...props} />,
};

SvgElement.craft = {
  props: SvgElementDefaultProps,
  related: {
    settings: SvgElementSettings,
  },
};

export default SvgElement;
