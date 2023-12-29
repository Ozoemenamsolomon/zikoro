import React, { useState } from "react";
import ViewAttendeesSection from "./viewAttendeesSection";
import { Button } from "@/components/ui/button";
import { attendeeTypeOptions } from "@/data/attendee";
import { MoreOptionsProps } from "@/app/people/all/FirstSection";
import { useUpdateAttendees } from "@/hooks/attendee";
import { DialogClose } from "../ui/dialog";
import { TAttendee } from "@/types/attendee";

const ChangeAttendeeType: React.FC<MoreOptionsProps> = ({ attendees }) => {
  const [selectedAttendees, setSelectedAttendees] = useState<TAttendee[]>([]);
  const [selectedAttendeeType, setSelectedAttendeeType] = useState<string>("");

  const { updateAttendees } = useUpdateAttendees();

  type ValueType = TAttendee | TAttendee[];

  const toggleValue = (value: ValueType) => {
    const updatedValue = Array.isArray(value)
      ? value
      : value && selectedAttendees.includes(value)
      ? selectedAttendees.filter((item) => item !== value)
      : [...selectedAttendees, value];

    console.log(updatedValue);

    setSelectedAttendees(updatedValue);
  };

  const onSubmit = () => {
    const payload = selectedAttendees.map((attendee) => ({
      ...attendee,
      attendeeType: [...attendee.attendeeType, selectedAttendeeType],
    }));

    updateAttendees({ payload });
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
                      selectedAttendeeType === value
                        ? "text-earlyBirdColor border-earlyBirdColor bg-[#EEF0FF]"
                        : "border-gray-600 text-gray-600 bg-white"
                    }
                  `}
              type="button"
              onClick={() =>
                setSelectedAttendeeType((prevVal) =>
                  prevVal === value ? "" : value
                )
              }
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
        selectedAttendeeType={selectedAttendeeType}
        toggleValue={toggleValue}
      />
      <DialogClose asChild>
        <Button
          disabled={
            selectedAttendees.length === 0 || selectedAttendeeType.length === 0
          }
          className="bg-basePrimary w-full"
          onClick={onSubmit}
        >
          Save
        </Button>
      </DialogClose>
    </div>
  );
};

export default ChangeAttendeeType;
