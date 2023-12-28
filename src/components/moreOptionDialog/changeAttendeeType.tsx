import React, { useState } from "react";
import ViewAttendeesSection from "./viewAttendeesSection";
import { ChangeAttendeeTypeProps } from "@/app/people/all/FirstSection";
import { Button } from "@/components/ui/button";

import { attendeeTypeOptions } from "@/data/attendee";

const ChangeAttendeeType: React.FC<ChangeAttendeeTypeProps> = ({
  attendees,
}) => {
  const [selectedAttendees, setSelectedAttendees] = useState<number[]>([]);
  const [selectedAttendeeType, setSelectedAttendeeType] = useState<string[]>(
    []
  );

  type ValueType = string | number | (string | number)[];

  const toggleValue = (
    selectedKey: "attendees" | "attendeeType",
    value: ValueType
  ) => {
    const key =
      selectedKey === "attendees" ? selectedAttendees : selectedAttendeeType;

    const updatedValue = Array.isArray(value)
      ? value
      : value && key.includes(value)
      ? key.filter((item: string | number) => item !== value)
      : [...key, value];

    console.log(updatedValue);

    selectedKey === "attendees"
      ? setSelectedAttendees(updatedValue)
      : setSelectedAttendeeType(updatedValue);
  };

  return (
    <div className="space-y-6 h-fit">
      <div className="flex flex-col gap-4 w-full rounded-md border border-input bg-background px-3 py-4 text-sm relative">
        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-[10px] px-1">
          Attendee Type
        </span>
        <div className="flex gap-2 flex-wrap justify-between">
          {attendeeTypeOptions.map(({ label, value }) => (
            <button
              className={`text-sm p-1.5 border-2 rounded font-medium",
                    ${
                      selectedAttendeeType.includes(value)
                        ? "text-earlyBirdColor border-earlyBirdColor bg-[#EEF0FF]"
                        : "border-gray-600 text-gray-600 bg-white"
                    }
                  `}
              type="button"
              onClick={() => toggleValue("attendeeType", value)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-[10px] font-medium text-gray-500">
          You can assign multiple roles to the attendee
        </span>
      </div>
      <ViewAttendeesSection
        attendees={attendees}
        selectedAttendees={selectedAttendees}
        toggleValue={toggleValue}
      />
      <Button
        disabled={
          selectedAttendees.length === 0 || selectedAttendeeType.length === 0
        }
        className="bg-basePrimary w-full"
      >
        Save
      </Button>
    </div>
  );
};

export default ChangeAttendeeType;
