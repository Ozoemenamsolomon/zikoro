import { useNode } from "@craftjs/core";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import Draggable from "react-draggable";
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

  console.log(width, height);

  const [startingPos, setStartingPos] = useState({ x: pageX, y: pageY });

  const handleStop = (e, data) => {
    setStartingPos({ x: data.x, y: data.y });
    setProp((prop: ImageProps) => {
      prop.pageX = data.x;
      prop.pageY = data.y;
    }, 500);
  };

  console.log(src, "source");
  return (
    <Draggable onStop={handleStop} position={startingPos}>
      <div
        ref={(ref) => connect(ref)}
        onClick={() => selected && setEditable(true)}
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
    <div className="flex gap-2">
      <div className="col-span-6 w-full rounded-md bg-background text-sm relative">
        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
          Width
        </span>
        <Input
          className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
          onInput={(e) => {
            setProp((props) => (props.width = e.currentTarget.value), 500);
          }}
          value={width}
        />
      </div>
      <div className="col-span-6 w-full rounded-md bg-background text-sm relative">
        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
          Height
        </span>
        <Input
          className="placeholder:text-sm placeholder:text-gray-200 text-gray-700"
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
