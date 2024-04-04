import { Switch } from "@/components/ui/switch";
import React from "react";
import { TabProps } from "../page";
import { Input } from "@/components/ui/input";
import { useEditor, Element } from "@craftjs/core";
import { Text as TextElement } from "@/components/certificate";
import { Textprops } from "@/components/certificate/Text";
import { cn } from "@/lib/utils";

interface TextTypes {
  label: string;
  props: Textprops;
}

const TextTypes: TextTypes[] = [
  {
    label: "Add a heading",
    props: {
      text: "heading",
      isBold: true,
      textAlign: "center",
      fontSize: 32,
      tagName: "h1",
      textTransform: "uppercase",
    },
  },
  {
    label: "Add a subheading",
    props: {
      text: "subheading",
      isBold: true,
      textAlign: "center",
      fontSize: 24,
      tagName: "h2",
      textTransform: "capitalize",
    },
  },
  {
    label: "Add a body text",
    props: {
      text: "body text",
      fontSize: 16,
    },
  },
];

const Text = ({ details, setValue }: TabProps) => {
  const { connectors } = useEditor();
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        {TextTypes.map(({ label, props }) => (
          <button
            ref={(ref) =>
              ref && connectors.create(ref, <TextElement {...props} />)
            }
            className={cn(
              "bg-gray-50 py-3 px-2 rounded text-gray-800 border",
              props.isBold && "font-bold"
            )}
            data-cy="toolbox-text"
            style={props}
          >
            {label}
          </button>
        ))}
      </div>
      {/* <div className="space-y-2">
        <div className="relative border-b py-4">
          <span className="text-tiny text-gray-500 font-medium absolute top-2 left-2">
            Heading
          </span>
          <Input
            type="text"
            className="outline-0 bg-transparent border-0 max-w-fit px-4 focus-visible:ring-0 flex justify-center text-lg"
            value={details.text.heading}
            onInput={(e) =>
              setValue("text", { ...details.text, heading: e.target.value })
            }
          />
        </div>
      </div>
      <div className="pb-2 flex justify-between items-center">
        <label className="text-lg font-medium text-gray-700">Location</label>
        <Switch
          className="data-[state=checked]:bg-basePrimary"
          checked={details.text.showLocation}
          onCheckedChange={(status) =>
            setValue("text", { ...details.text, showLocation: status })
          }
        />
      </div>
      <div className="pb-2 flex justify-between items-center">
        <label className="text-lg font-medium text-gray-700">Date</label>
        <Switch
          className="data-[state=checked]:bg-basePrimary"
          checked={details.text.showDate}
          onCheckedChange={(status) =>
            setValue("text", { ...details.text, showDate: status })
          }
        />
      </div> */}
    </div>
  );
};

export default Text;
