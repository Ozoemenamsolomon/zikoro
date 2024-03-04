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
import { cn } from "@/lib/utils";

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

  const [startingPos, setStartingPos] = useState<ControlPosition>({
    x: pageX || 0,
    y: pageY || 0,
  });

  const handleStop: DraggableEventHandler = (e, data) => {
    setStartingPos({ x: data.x, y: data.y });
    setProp((prop: Textprops) => {
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
        onClick={() => selected}
        onDoubleClick={() => setEditable(true)}
        className={cn(editable ? "cursor-text" : "cursor-move")}
      >
        <ContentEditable
          html={text}
          disabled={!editable}
          onChange={(e) =>
            setProp(
              (props: Textprops) =>
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
          className={cn(selected && "border-2 border-sky-400")}
        />
      </div>
    </Draggable>
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

  type TextAlign = "left" | "center" | "right" | "justify";
  type TextAlignSwitcherProps = {
    defaultAlignment?: TextAlign;
  };

  function TextAlignSwitcher({
    defaultAlignment = "left",
  }: TextAlignSwitcherProps) {
    // Define state to manage the text alignment
    const [textAlign, setTextAlign] = useState<TextAlign>(defaultAlignment);

    // Function to toggle text alignment
    const toggleTextAlign = () => {
      // Switch between text alignment values
      setTextAlign((prevAlign) => {
        switch (prevAlign) {
          case "left":
            return "center";
          case "center":
            return "right";
          case "right":
            return "justify";
          case "justify":
            return "left";

          default:
            return "left";
        }
      });
    };

    useEffect(() => {
      setProp((props: Textprops) => (props.textAlign = textAlign), 500);
    }, [textAlign]);

    return (
      <Button onClick={toggleTextAlign} variant="outline" size="icon">
        {textAlign === "left" ? (
          <svg
            width={16}
            height={16}
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM2 7.5C2 7.22386 2.22386 7 2.5 7H7.5C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8H2.5C2.22386 8 2 7.77614 2 7.5ZM2 10.5C2 10.2239 2.22386 10 2.5 10H10.5C10.7761 10 11 10.2239 11 10.5C11 10.7761 10.7761 11 10.5 11H2.5C2.22386 11 2 10.7761 2 10.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        ) : textAlign === "center" ? (
          <svg
            width={16}
            height={16}
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM4 7.5C4 7.22386 4.22386 7 4.5 7H10.5C10.7761 7 11 7.22386 11 7.5C11 7.77614 10.7761 8 10.5 8H4.5C4.22386 8 4 7.77614 4 7.5ZM3 10.5C3 10.2239 3.22386 10 3.5 10H11.5C11.7761 10 12 10.2239 12 10.5C12 10.7761 11.7761 11 11.5 11H3.5C3.22386 11 3 10.7761 3 10.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        ) : textAlign === "right" ? (
          <svg
            width={16}
            height={16}
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4.5C2 4.22386 2.22386 4 2.5 4H12.5C12.7761 4 13 4.22386 13 4.5C13 4.77614 12.7761 5 12.5 5H2.5C2.22386 5 2 4.77614 2 4.5ZM7 7.5C7 7.22386 7.22386 7 7.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H7.5C7.22386 8 7 7.77614 7 7.5ZM4 10.5C4 10.2239 4.22386 10 4.5 10H12.5C12.7761 10 13 10.2239 13 10.5C13 10.7761 12.7761 11 12.5 11H4.5C4.22386 11 4 10.7761 4 10.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            width={16}
            height={16}
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 4C2.22386 4 2 4.22386 2 4.5C2 4.77614 2.22386 5 2.5 5H12.5C12.7761 5 13 4.77614 13 4.5C13 4.22386 12.7761 4 12.5 4H2.5ZM2 7.5C2 7.22386 2.22386 7 2.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H2.5C2.22386 8 2 7.77614 2 7.5ZM2 10.5C2 10.2239 2.22386 10 2.5 10H12.5C12.7761 10 13 10.2239 13 10.5C13 10.7761 12.7761 11 12.5 11H2.5C2.22386 11 2 10.7761 2 10.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        )}
      </Button>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <div className="space-y-2 font-sans">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <svg
                width={15}
                height={15}
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.78233 2.21707C2.70732 2.14206 2.60557 2.09991 2.49949 2.09991C2.3934 2.09991 2.29166 2.14206 2.21664 2.21707L0.216645 4.21707C0.0604351 4.37328 0.0604351 4.62655 0.216645 4.78276C0.372855 4.93897 0.626121 4.93897 0.78233 4.78276L2.09949 3.4656L2.09949 11.5342L0.78233 10.2171C0.62612 10.0609 0.372854 10.0609 0.216645 10.2171C0.0604349 10.3733 0.0604349 10.6265 0.216645 10.7828L2.21664 12.7828C2.29166 12.8578 2.3934 12.8999 2.49949 12.8999C2.60557 12.8999 2.70731 12.8578 2.78233 12.7828L4.78233 10.7828C4.93854 10.6265 4.93854 10.3733 4.78233 10.2171C4.62612 10.0609 4.37285 10.0609 4.21664 10.2171L2.89949 11.5342L2.89949 3.4656L4.21664 4.78276C4.37285 4.93897 4.62612 4.93897 4.78233 4.78276C4.93854 4.62655 4.93854 4.37328 4.78233 4.21707L2.78233 2.21707ZM10.5 2.74997C10.7107 2.74997 10.8988 2.88211 10.9703 3.08036L13.9703 11.3999C14.064 11.6597 13.9293 11.9462 13.6696 12.0399C13.4098 12.1336 13.1233 11.9989 13.0296 11.7392L12.0477 9.016H8.95228L7.97033 11.7392C7.87666 11.9989 7.59013 12.1336 7.33036 12.0399C7.07059 11.9462 6.93595 11.6597 7.02962 11.3999L10.0296 3.08036C10.1011 2.88211 10.2892 2.74997 10.5 2.74997ZM10.5 4.72396L11.7412 8.166H9.25879L10.5 4.72396Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-4 w-[250px]">
            <label>Font size</label>
            <Slider
              defaultValue={[16]}
              value={[fontSize]}
              step={4}
              min={16}
              max={50}
              onValueChange={(value) => {
                setProp(
                  (props: Textprops) => (props.fontSize = value[0]),
                  1000
                );
              }}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-2">
        <Toggle
          variant="outline"
          aria-label="Toggle italic"
          pressed={isBold}
          onPressedChange={(value) => {
            setProp((props: Textprops) => (props.isBold = value), 1000);
          }}
        >
          <FontBoldIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          variant="outline"
          aria-label="Toggle italic"
          pressed={isItalic}
          onPressedChange={(value) => {
            setProp((props: Textprops) => (props.isItalic = value), 1000);
          }}
        >
          <FontItalicIcon className="h-4 w-4" />
        </Toggle>
        <Toggle
          variant="outline"
          aria-label="Toggle italic"
          pressed={isUnderline}
          onPressedChange={(value) => {
            setProp((props: Textprops) => (props.isUnderline = value), 1000);
          }}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        <TextAlignSwitcher defaultAlignment={textAlign} />
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
                setProp((props: Textprops) => (props.color = color), 1000)
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={16}
                viewBox="0 -960 960 960"
                width={16}
              >
                <path d="M560-160v-520H360v-120h520v120H680v520H560Zm-360 0v-320H80v-120h360v120H320v320H200Z" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={fontFamily}
              onValueChange={(value) =>
                setProp((props: Textprops) => (props.fontFamily = value))
              }
            >
              <DropdownMenuRadioItem value="serif">Serif</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="sans-serif">
                San-Serif
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Roboto">
                Roboto
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Inter">Inter</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="Lato">Lato</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="DancingScript">
                Dancing script
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
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
  pageX: 0,
  pageY: 0,
};

Text.craft = {
  props: TextDefaultProps,
  related: {
    settings: TextSettings,
  },
};

export default Text;
