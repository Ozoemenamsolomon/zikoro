import { Switch } from "@/components/ui/switch";
import React from "react";
import { TabProps } from "../page";
import { Input } from "@/components/ui/input";

const Text = ({ details, setValue }: TabProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
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
      </div>
    </div>
  );
};

export default Text;
