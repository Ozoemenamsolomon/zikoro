import { useNode } from "@craftjs/core";
import React, { useState, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import { Slider } from "../ui/slider";
import {
  ChevronRightIcon,
  FontBoldIcon,
  FontItalicIcon,
  UnderlineIcon,
} from "@radix-ui/react-icons";
import { Toggle } from "../ui/toggle";
import Draggable from "react-draggable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";

export interface Textprops {
  isBold?: boolean;
  text: string;
  fontSize?: number;
  fontFamily?: string;
  textAlign?: "left" | "right" | "center" | "justify" | "start" | "end";
  color?: string;
  isItalic?: boolean;
  isUnderline?: boolean;
  tagName?: "h1" | "h2" | "p";
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
  pageX?: number;
  pageY?: number;
}

const Text = ({
  text,
  fontSize,
  textAlign,
  fontFamily,
  color,
  isBold,
  isItalic,
  isUnderline,
  tagName,
  textTransform,
  pageX,
  pageY,
}: Textprops) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

  const [startingPos, setStartingPos] = useState({ x: pageX, y: pageY });

  const handleStop = (e, data) => {
    setStartingPos({ x: data.x, y: data.y });
    setProp((prop: ImageProps) => {
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
    <div
      ref={(ref) => connect(ref)}
      onClick={() => selected && setEditable(true)}
    >
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) =>
          setProp(
            (props) =>
              (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")),
            500
          )
        }
        tagName={tagName}
        style={{
          fontSize: `${fontSize}px`,
          textAlign,
          color,
          fontFamily,
          fontWeight: isBold ? 600 : 400,
          fontStyle: isItalic ? "italic" : "normal",
          textDecoration: isUnderline ? "underline" : "none",
          textTransform,
        }}
      />
    </div>
  );
};

const TextSettings = () => {
  const {
    actions: { setProp },
    isBold,
    fontSize,
    fontFamily,
    textAlign,
    color,
    isItalic,
    isUnderline,
  } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    isBold: node.data.props.isBold,
    isItalic: node.data.props.isItalic,
    color: node.data.props.color,
    isUnderline: node.data.props.isUnderline,
    fontFamily: node.data.props.fontFamily,
    textAlign: node.data.props.textAlign,
  }));

  return (
    <div className="flex justify-between gap-2">
      <div className="space-y-2 flex-1">
        <label>Font size</label>
        <Slider
          defaultValue={[16]}
          value={[fontSize]}
          step={4}
          min={16}
          max={50}
          onValueChange={(value) => {
            setProp((props) => (props.fontSize = value), 1000);
          }}
        />
      </div>
      <div className="flex gap-2">
        <Toggle
          variant="outline"
          aria-label="Toggle italic"
          pressed={isBold}
          onPressedChange={(value) => {
            setProp((props) => (props.isBold = value), 1000);
          }}
        >
          <FontBoldIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          variant="outline"
          aria-label="Toggle italic"
          pressed={isItalic}
          onPressedChange={(value) => {
            setProp((props) => (props.isItalic = value), 1000);
          }}
        >
          <FontItalicIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          variant="outline"
          aria-label="Toggle italic"
          pressed={isUnderline}
          onPressedChange={(value) => {
            setProp((props) => (props.isUnderline = value), 1000);
          }}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
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
                setProp((props) => (props.color = color), 1000)
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const TextDefaultProps: Textprops = {
  text: "Hi",
  fontSize: 20,
  isBold: false,
  isItalic: false,
  color: "#000",
  isUnderline: false,
  tagName: "p",
  textAlign: "left",
  textTransform: "none",
};

Text.craft = {
  props: TextDefaultProps,
  related: {
    settings: TextSettings,
  },
};

export default Text;
