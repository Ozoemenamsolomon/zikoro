import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateAttendees } from "@/hooks/services/attendee";
import { TAttendee } from "@/types/attendee";
import React, { useEffect, useState } from "react";
// import { DialogClose } from "../ui/dialog";
import ViewAttendeesSection from "./viewAttendeesSection";
import { isWithinTimeRange } from "@/utils/date";
import { DialogClose } from "../ui/dialog";
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import { MoreOptionsProps } from "@/app/(mainApp)/(dashboard)/event/[eventId]/(home)/people/_reusable/FirstSection";

const checkinMultiple: React.FC<MoreOptionsProps> = ({
  attendees,
  getAttendees,
  attendeesTags,
  favourites,
  event,
}) => {
  
  const [mappedAttendees, setMappedAttendees] =
    useState<TAttendee[]>(attendees);
  const [selectedAttendees, setSelectedAttendees] = useState<TAttendee[]>([]);
  const [eventDate, setEventDate] = useState<string | null>(null);
  const [action, setAction] = useState<"checkin" | "undo">("checkin");

  useEffect(() => {
    
    if (!eventDate) return;
    

    

    setMappedAttendees(
      attendees.filter(({ checkin }) => {
        if (action === "checkin") {
          return (
            !checkin ||
            !checkin.some((entry) => isSameDay(eventDate, entry.date))
          );
        } else {
          return (
            (checkin &&
              checkin?.some((entry) => isSameDay(eventDate, entry.date))) ||
            false
          );
        }
      })
    );
  }, [attendees, eventDate, action]);

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
    if (!eventDate) return;

    const newDate = new Date(eventDate);
    

    const payload = selectedAttendees.map((attendee) => {
      const existingCheckin = attendee.checkin || [];
      const newCheckin =
        action === "checkin"
          ? [...(existingCheckin ?? []), { date: newDate, checkin: true }]
          : existingCheckin.filter(({ date }) => !isSameDay(newDate, date));

      return {
        ...attendee,
        checkin: newCheckin,
      };
    });

    

    await updateAttendees({ payload });
    await getAttendees();
  };

  useEffect(() => {
    toggleValue([]);
  }, [eventDate, action]);

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
            if (value !== "checkin" && value !== "undo") return;
            setAction(value);
          }}
        >
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={"checkin"}
                id="checkin"
                className="text-basePrimary"
              />
              <Label htmlFor="checkin">Check-in</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="undo"
                id="undo"
                className="text-basePrimary"
              />
              <Label htmlFor="undo">Undo check-in</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div className="relative h-fit w-full">
        <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
          Event Date
        </span>
        <div className="!mt-0 text-sm absolute top-1/2 -translate-y-1/2 left-2 text-gray-700 z-10 font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={15}
            height={17}
            viewBox="0 0 15 17"
            fill="none"
          >
            <path
              d="M13 8.25781C13.3125 8.47135 13.5911 8.71354 13.8359 8.98438C14.0807 9.25521 14.2917 9.55208 14.4688 9.875C14.6458 10.1979 14.776 10.5391 14.8594 10.8984C14.9427 11.2578 14.9896 11.625 15 12C15 12.6198 14.8828 13.2031 14.6484 13.75C14.4141 14.2969 14.0911 14.7734 13.6797 15.1797C13.2682 15.5859 12.7917 15.9062 12.25 16.1406C11.7083 16.375 11.125 16.4948 10.5 16.5C10.026 16.5 9.56771 16.4297 9.125 16.2891C8.68229 16.1484 8.27604 15.9453 7.90625 15.6797C7.53646 15.4141 7.20833 15.0964 6.92188 14.7266C6.63542 14.3568 6.41406 13.9479 6.25781 13.5H0V1.5H2V0.5H3V1.5H10V0.5H11V1.5H13V8.25781ZM1 2.5V4.5H12V2.5H11V3.5H10V2.5H3V3.5H2V2.5H1ZM6.02344 12.5C6.00781 12.3385 6 12.1719 6 12C6 11.5521 6.0625 11.1172 6.1875 10.6953C6.3125 10.2734 6.5026 9.875 6.75781 9.5H6V8.5H7V9.17188C7.21354 8.90625 7.45052 8.67188 7.71094 8.46875C7.97135 8.26562 8.2526 8.09115 8.55469 7.94531C8.85677 7.79948 9.17188 7.6901 9.5 7.61719C9.82812 7.54427 10.1615 7.50521 10.5 7.5C11.0208 7.5 11.5208 7.58594 12 7.75781V5.5H1V12.5H6.02344ZM10.5 15.5C10.9844 15.5 11.4375 15.4089 11.8594 15.2266C12.2812 15.0443 12.651 14.7943 12.9688 14.4766C13.2865 14.1589 13.5365 13.7891 13.7188 13.3672C13.901 12.9453 13.9948 12.4896 14 12C14 11.5156 13.9089 11.0625 13.7266 10.6406C13.5443 10.2188 13.2943 9.84896 12.9766 9.53125C12.6589 9.21354 12.2891 8.96354 11.8672 8.78125C11.4453 8.59896 10.9896 8.50521 10.5 8.5C10.0156 8.5 9.5625 8.59115 9.14062 8.77344C8.71875 8.95573 8.34896 9.20573 8.03125 9.52344C7.71354 9.84115 7.46354 10.2109 7.28125 10.6328C7.09896 11.0547 7.00521 11.5104 7 12C7 12.4844 7.09115 12.9375 7.27344 13.3594C7.45573 13.7812 7.70573 14.151 8.02344 14.4688C8.34115 14.7865 8.71094 15.0365 9.13281 15.2188C9.55469 15.401 10.0104 15.4948 10.5 15.5ZM11 11.5H12.5V12.5H10V9.5H11V11.5ZM2 8.5H3V9.5H2V8.5ZM4 8.5H5V9.5H4V8.5ZM4 6.5H5V7.5H4V6.5ZM2 10.5H3V11.5H2V10.5ZM4 10.5H5V11.5H4V10.5ZM7 7.5H6V6.5H7V7.5ZM9 7.5H8V6.5H9V7.5ZM11 7.5H10V6.5H11V7.5Z"
              fill="#717171"
            />
          </svg>
        </div>
        <Select onValueChange={(value) => setEventDate(value)}>
          <SelectTrigger className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 pl-12 w-full">
            <SelectValue placeholder="Select Event Date" />
          </SelectTrigger>
          <SelectContent>
            {eachDayOfInterval({
              start: event?.startDateTime,
              end: event?.endDateTime,
            }).map((date) => (
              <SelectItem value={date.toISOString()}>
                {format(date, "PPP")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
          disabled={selectedAttendees.length === 0 || !eventDate}
          className="bg-basePrimary w-full"
          onClick={onSubmit}
        >
          Save
        </Button>
      </DialogClose>
    </div>
  );
};

export default checkinMultiple;
