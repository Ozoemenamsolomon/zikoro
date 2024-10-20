import { useNode } from "@craftjs/core";
// import { Slider } from "@material-ui/core";
// import { Paper, FormControl, FormLabel } from "@material-ui/core";
// import ColorPicker from "material-ui-color-picker";
import React, { useEffect, useState } from "react";
import { FormControl, FormLabel } from "../ui/form";
import { Slider } from "../ui/slider";
import Draggable, {
  ControlPosition,
  DraggableEventHandler,
} from "react-draggable";
import { cn } from "@/lib";
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

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
  pageX?: number;
  pageY?: number;
  background?: string;
  width?: number;
  height?: number;
  notSelectable?: boolean;
}

const Container = ({
  width,
  height,
  children,
  className,
  pageX,
  pageY,
  background = "#fff",
  notSelectable = false,
}: ContainerProps) => {
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
    setProp((prop: ContainerProps) => {
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
    <Draggable
      disabled={notSelectable}
      onStop={handleStop}
      position={startingPos}
    >
      <div
        ref={(ref) => ref && connect(drag(ref))}
        onClick={() => !notSelectable && selected && setEditable(true)}
        className={cn(
          "cursor-move w-fit h-fit",
          selected && "border-2 border-sky-400"
        )}
        style={{ minWidth: width + "px", minHeight: height + "px" }}
      >
        <div className={className} style={{ background }}>
          {children}
        </div>
      </div>
    </Draggable>
  );
};

export const ContainerSettings = () => {
  const {
    background,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    padding: node.data.props.padding,
  }));

  return (
    <div className="flex justify-end gap-2">
      <div>Background</div>
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
              color={background}
              onChange={(color) =>
                setProp(
                  (props: ContainerProps) => (props.background = color),
                  1000
                )
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const ContainerDefaultProps = {
  className: "",
  width: 200,
  height: 200,
  notSelectable: false,
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};

export default Container;
