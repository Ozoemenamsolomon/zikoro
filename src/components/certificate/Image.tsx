import { useNode } from "@craftjs/core";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import Draggable, { ControlPosition } from "react-draggable";
import { Resizable } from "re-resizable";

export interface ImageProps {
  width?: number;
  height?: number;
  src: string;
  pageX?: number;
  pageY?: number;
}

const Image = ({ width, height, src, pageX, pageY }: ImageProps) => {
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

  const handleStop = (e, data) => {
    setStartingPos({ x: data.x, y: data.y });
    setProp((prop: ImageProps) => {
      prop.pageX = data.x;
      prop.pageY = data.y;
    }, 500);
  };

  return (
    <Draggable onStop={handleStop} position={startingPos}>
      <div
        ref={(ref) => connect(ref)}
        onClick={() => selected && setEditable(true)}
        className="cursor-move"
      >
        <div
          style={{ width: width + "px", height: height + "px" }}
          className={cn(selected && "border-2 border-sky-400")}
        >
          <img className="w-full h-full" src={src} />
        </div>
      </div>
    </Draggable>
  );
};

const ImageSettings = () => {
  const {
    actions: { setProp },
    url,
    height,
    width,
  } = useNode((node) => ({
    url: node.data.props.url,
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
            setProp((props) => (props.width = e.currentTarget.value), 500);
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
            setProp((props) => (props.height = e.currentTarget.value), 500);
          }}
          value={height}
        />
      </div>
    </div>
  );
};

export const ImageDefaultProps: ImageProps = {
  src: "",
  width: 200,
  height: 200,
  pageX: 0,
  pageY: 0,
};

Image.craft = {
  props: ImageDefaultProps,
  related: {
    settings: ImageSettings,
  },
};

export default Image;
