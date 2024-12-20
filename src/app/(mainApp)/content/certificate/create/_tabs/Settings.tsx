import React, { useState } from "react";
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

const Settings = ({ settings, editSettings }: TabProps) => {
  const [criteria, setCriteria] = useState<number>(0);
  const [date, setDate] = React.useState<Date>();
  const [newSkill, setSkill] = React.useState<string>("");

  return (
    <div className="pb-2">
      <h4 className="text-lg text-gray-700 font-medium">Paper Format</h4>
      <div className="space-y-2 text-gray-500 pt-2 pb-4">
        <div className="flex justify-between">
          <span className="font-medium text-sm">Size</span>
          <RadioGroup
            onValueChange={(value) => editSettings("size", value)}
            value={settings.size}
            className="flex gap-2 text-sm"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="A4" id="A4" />
              <Label htmlFor="A4">A4</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="letter" id="letter" />
              <Label htmlFor="letter">Letter</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-sm">Orientation</span>
          <RadioGroup
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
        <div className="space-y-2 text-sm font-medium text-gray-500 pt-2 pb-4">
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
        <div className="pt-4 border-t-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium text-sm">
              Attendance Criteria
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  editSettings(
                    "criteria",
                    settings.criteria > 5 ? settings.criteria - 5 : 0
                  )
                }
                disabled={settings.criteria === 0}
                className={`${
                  settings.criteria > 0 ? "text-basePrimary" : "text-gray-500"
                } disabled:opacity-70`}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth={0}
                  viewBox="0 0 1024 1024"
                  height="1.5em"
                  width="1.5em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M696 480H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                </svg>
              </button>
              <span className="text-sm font-medium text-gray-500">
                {settings.criteria}%
              </span>
              <button
                onClick={() =>
                  editSettings(
                    "criteria",
                    settings.criteria < 95 ? settings.criteria + 5 : 100
                  )
                }
                disabled={settings.criteria === 100}
                type="button"
                className={`${
                  settings.criteria < 100 ? "text-basePrimary" : "text-gray-500"
                } disabled:opacity-70`}
              >
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth={0}
                  viewBox="0 0 1024 1024"
                  height="1.5em"
                  width="1.5em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-4 border-t-2 space-y-4 pb-2">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Expires on</span>
          <Switch
            className="data-[state=checked]:bg-basePrimary"
            checked={settings.canExpire}
            onCheckedChange={(status) => editSettings("canExpire", status)}
          />
        </div>
        {settings.canExpire && (
          <div className="col-span-6 w-full rounded-md bg-background text-sm relative">
            <span className="absolute top-0 -translate-y-1/2 right-4 bg-white text-gray-600 text-tiny px-1">
              Expiry date
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full flex gap-2 items-center justify-start text-left font-normal",
                    !settings.expiryDate && "text-muted-foreground"
                  )}
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 1024 1024"
                    height="1.5em"
                    width="1.5em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M712 304c0 4.4-3.6 8-8 8h-56c-4.4 0-8-3.6-8-8v-48H384v48c0 4.4-3.6 8-8 8h-56c-4.4 0-8-3.6-8-8v-48H184v136h656V256H712v48z" />
                    <path d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zm0-448H184V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136z" />
                  </svg>

                  {settings.expiryDate ? (
                    format(settings.expiryDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="flex w-auto flex-col space-y-2 p-2"
              >
                <Select
                  onValueChange={(value) =>
                    editSettings(
                      "expiryDate",
                      addDays(new Date(), parseInt(value))
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="0">Same Day</SelectItem>
                    <SelectItem value="365">In a year</SelectItem>
                    <SelectItem value="1825">In 5 years</SelectItem>
                    <SelectItem value="3650">In 10 years</SelectItem>
                  </SelectContent>
                </Select>
                <div className="rounded-md border">
                  <Calendar
                    mode="single"
                    selected={settings.expiryDate}
                    onSelect={(date) => editSettings("expiryDate", date)}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      <div className="space-y-2 pt-4 border-t-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="border-basePrimary border-2 text-basePrimary bg-transparent flex gap-2">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 1024 1024"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z" />
                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
              </svg>
              <span>Skills</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="px-3">
            <DialogHeader>
              <DialogTitle>
                <span className="capitalize">Add Skills</span>
              </DialogTitle>
            </DialogHeader>
            <div className="relative border-b py-4">
              <span className="text-tiny text-gray-500 font-medium absolute top-2 left-2">
                skill
              </span>
              <Input
                type="text"
                className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 focus-visible:ring-0"
                value={newSkill}
                onInput={(e) => setSkill(e.currentTarget.value)}
              />
            </div>
            <DialogClose asChild>
              <Button
                onClick={() =>
                  editSettings("skills", [...settings.skills, newSkill])
                }
                className="bg-basePrimary"
              >
                Add Skill
              </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <div className="flex flex-wrap justify-start gap-2">
          {settings.skills.map((skill) => (
            <div
              className={`text-sm p-1.5 border-2 rounded font-medium text-earlyBirdColor border-earlyBirdColor bg-[#EEF0FF]`}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
