import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabProps } from "../page";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ViewAttendeesSection from "@/components/moreOptionDialog/viewAttendeesSection";
import { useGetAttendees } from "@/hooks/services/attendee";
import { TAttendee } from "@/types/attendee";
import { calculateAndSetMaxHeight } from "@/utils/helpers";
import COLORTAG from "@/utils/colorTag";

const Settings = ({ settings, editSettings }: TabProps) => {
  const [criteria, setCriteria] = useState<number>(0);
  const [date, setDate] = React.useState<Date>();
  const [newSkill, setSkill] = React.useState<string>("");
  const [color, setColor] = React.useState<string>("");

  const { attendees, isLoading } = useGetAttendees();

  console.log(settings.canReceive.exceptions);
  const [selectedAttendees, setSelectedAttendees] = useState<TAttendee[]>(
    settings.canReceive.exceptions
      ? attendees.filter(({ id }) =>
        settings.canReceive.exceptions?.includes(id)
      )
      : []
  );

  console.log(selectedAttendees);

  type ValueType = TAttendee | TAttendee[];

  const toggleValue = (value: ValueType) => {
    const updatedValue = Array.isArray(value)
      ? value
      : value && selectedAttendees.includes(value)
        ? selectedAttendees.filter((item) => item !== value)
        : [...selectedAttendees, value];

    setSelectedAttendees(updatedValue);
  };

  const setRecipients = () => {
    editSettings("canReceive", {
      ...settings.canReceive,
      exceptions: selectedAttendees.map(({ id }) => id),
    });
  };

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!divRef) return;
    calculateAndSetMaxHeight(divRef);
  }, []);

  return (
    <div ref={divRef} className="hide-scrollbar">
      <h4 className="text-lg text-gray-700 font-medium">Paper Format</h4>
      <div className="space-y-4 text-gray-500 pt-2 pb-4">
        <div className="flex justify-between">
          <span className="font-medium text-sm">Size</span>
          <RadioGroup
            disabled
            onValueChange={(value) => editSettings("size", value)}
            value={settings.size}
            className="flex gap-2 text-sm"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="A4" id="A4" />
              <Label htmlFor="A4">A5</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="letter" id="letter" />
              <Label htmlFor="letter">A6</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-sm">Orientation</span>
          <RadioGroup
            disabled
            onValueChange={(value) => editSettings("orientation", value)}
            value={settings.orientation}
            className="flex gap-2 text-sm"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="portrait" id="portrait" />
              <Label htmlFor="portrait">Portrait</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="landscape" id="landscape" />
              <Label htmlFor="landscape">Landscape</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      <div className="border-t-2 pb-2 pt-4">
        <h4 className="text-gray-700 font-medium">
          Who should receive this certificate?
        </h4>
        <div className="space-y-4 text-sm font-medium text-gray-500 pt-2 pb-4">
          <div>
            <div className="flex justify-between">
              <span>Event Attendees</span>
              <Switch
                className="data-[state=checked]:bg-basePrimary"
                checked={settings.canReceive.eventAttendees}
                onCheckedChange={(status) =>
                  editSettings("canReceive", {
                    ...settings.canReceive,
                    eventAttendees: status,
                  })
                }
              />
            </div>
            {settings.canReceive.eventAttendees && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={"ghost"}
                    className="text-sm font-medium flex flex-col items-start gap-1 p-0 mt-2 mb-4"
                  >
                    <span className="text-basePrimary flex gap-1">      <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 1024 1024"
                      height="1.5em"
                      width="1.5em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"></path>
                      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                    </svg> Exceptions</span>
                    <i className="text-xs">
                      {
                        (selectedAttendees && selectedAttendees.length > 0) && selectedAttendees.length + " attendees will not receive this badge"

                      }
                    </i>
                  </Button>
                </DialogTrigger>
                <DialogContent className="px-3 max-h-[500px] overflow-auto hide-scrollbar">
                  <DialogHeader>
                    <DialogTitle>
                      <span className="capitalize">Exceptions</span>
                    </DialogTitle>
                  </DialogHeader>
                  <ViewAttendeesSection
                    attendees={attendees}
                    selectedAttendees={selectedAttendees}
                    toggleValue={toggleValue}
                  />
                  <DialogClose>
                    <Button
                      disabled={selectedAttendees.length === 0}
                      className="bg-basePrimary w-full"
                      onClick={setRecipients}
                    >
                      Add Exceptions
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <div className="flex justify-between">
            <span>Track Attendees</span>
            <Switch
              className="data-[state=checked]:bg-basePrimary"
              checked={settings.canReceive.trackAttendees}
              onCheckedChange={(status) =>
                editSettings("canReceive", {
                  ...settings.canReceive,
                  trackAttendees: status,
                })
              }
            />
          </div>
          <div className="flex justify-between">
            <span>Session Attendees</span>
            <Switch
              className="data-[state=checked]:bg-basePrimary"
              checked={settings.canReceive.sessionAttendees}
              onCheckedChange={(status) =>
                editSettings("canReceive", {
                  ...settings.canReceive,
                  sessionAttendees: status,
                })
              }
            />
          </div>
          <div className="flex justify-between">
            <span>Quiz Participants</span>
            <Switch
              className="data-[state=checked]:bg-basePrimary"
              checked={settings.canReceive.quizParticipants}
              onCheckedChange={(status) =>
                editSettings("canReceive", {
                  ...settings.canReceive,
                  quizParticipant: status,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
