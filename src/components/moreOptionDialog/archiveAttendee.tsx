import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUpdateAttendees } from "@/hooks/services/attendee";
import { TAttendee } from "@/types/attendee";
import React, { useEffect, useState } from "react";
// import { DialogClose } from "../ui/dialog";
import ViewAttendeesSection from "./viewAttendeesSection";
import { DialogClose } from "../ui/dialog";
import { MoreOptionsProps } from "@/app/(mainApp)/(dashboard)/event/[eventId]/(home)/people/_reusable/FirstSection";

const ArchiveAttendee: React.FC<MoreOptionsProps> = ({
  attendees,
  getAttendees,
  attendeesTags,
  favourites,
  event,
}) => {
  const [mappedAttendees, setMappedAttendees] =
    useState<TAttendee[]>(attendees);
  const [selectedAttendees, setSelectedAttendees] = useState<TAttendee[]>([]);
  const [action, setAction] = useState<string>("archive");

  useEffect(() => {
    setMappedAttendees(
      attendees.filter(({ archive }) => {
        if (action === "archive") {
          return !archive;
        } else {
          return archive;
        }
      })
    );
  }, [attendees, action]);

  const { updateAttendees } = useUpdateAttendees();

  type ValueType = TAttendee | TAttendee[];

  const toggleValue = (value: ValueType) => {
    const updatedValue = Array.isArray(value)
      ? value
      : value && selectedAttendees.includes(value)
      ? selectedAttendees.filter((item) => item !== value)
      : [...selectedAttendees, value];

    setSelectedAttendees(updatedValue);
  };

  const onSubmit = async () => {
    const payload = selectedAttendees.map((attendee) => ({
      ...attendee,
      archive: action === "archive" ? true : false,
    }));

    await updateAttendees({ payload });
    await getAttendees();
  };

  useEffect(() => {
    toggleValue([]);
  }, [action]);

  return (
    <div className="space-y-6 max-h-[80vh] overflow-auto hide-scrollbar py-4 pl-4 pr-1">
      <div className="flex flex-col gap-4 w-full rounded-md border border-input bg-background px-3 py-4 text-sm relative">
        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
          Action
        </span>
        <RadioGroup
          defaultValue={action}
          value={action}
          onValueChange={(value) => {
            if (value !== "archive" && value !== "unarchive") return;
            setAction(value);
          }}
        >
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={"archive"}
                id="archive"
                className="text-basePrimary"
              />
              <Label htmlFor="archive">Archive</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="unarchive"
                id="unarchive"
                className="text-basePrimary"
              />
              <Label htmlFor="unarchive">Unarchive</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      <ViewAttendeesSection
        attendeesTags={attendeesTags}
        favourites={favourites}
        attendees={mappedAttendees}
        selectedAttendees={selectedAttendees}
        toggleValue={toggleValue}
      />
      <DialogClose asChild>
        <Button
          disabled={selectedAttendees.length === 0}
          className="bg-basePrimary w-full"
          onClick={onSubmit}
        >
          Continue
        </Button>
      </DialogClose>
    </div>
  );
};

export default ArchiveAttendee;
