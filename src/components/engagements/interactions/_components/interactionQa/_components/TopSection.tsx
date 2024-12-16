import { Button } from "@/components/custom_ui/Button";
import { cn } from "@/lib";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import { TEventQa } from "@/types";
import { EventQaSetting } from "../../modals/EventQaSetting";
import { Settings } from "styled-icons/feather";

type TopSectionProp = {
  allQuestionsCount: number;
  myQuestionsCount: number;
  awaitingReviewCount?: number;
  isAttendee?: boolean;
  activeState: number;
  setActiveState: (i: number) => void;
  filterValue: string;
  qa?: TEventQa;
  eventAlias: string;
  setFilterValue: React.Dispatch<React.SetStateAction<string>>;
};

export function TopSection({
  allQuestionsCount = 0,
  awaitingReviewCount = 0,
  myQuestionsCount = 0,
  isAttendee,
  activeState,
  setActiveState,
  filterValue,
  setFilterValue,
  qa,
  eventAlias,
}: TopSectionProp) {
  const [isOpen, setOpen] = useState(false);
  const filters = [
    { value: "Recent", label: "Recent" },
    { value: "Top Liked", label: "Top Liked" },
  ];

  function onClose() {
    setOpen((p) => !p);
  }

  async function refetch() {
    window.location.reload();
  }
  return (
    <div className="w-full overflow-x-auto no-scrollbar ">
      <div className=" min-w-[900px] w-full bg-white px-4 sm:px-6 flex items-center text-sm justify-center gap-10 sm:gap-20">
      <button
        onClick={() => setActiveState(1)}
        className={cn(
          "px-2 py-4 flex items-center gap-x-1 text-sm",
          activeState === 1 && "text-basePrimary border-b border-basePrimary"
        )}
      >
        <p>All Questions</p>
        <span className="text-xs font-medium px-2 py-1 flex items-center justify-center rounded-full bg-basePrimary text-white">
          {allQuestionsCount}
        </span>
      </button>
      <button
        onClick={() => setActiveState(2)}
        className={cn(
          "px-2 py-4 flex items-center gap-x-1 text-sm",
          activeState === 2 && "text-basePrimary border-b border-basePrimary"
        )}
      >
        <p>My Questions</p>
        <span className="text-xs font-medium px-2 py-1 flex items-center justify-center rounded-full bg-basePrimary text-white">
          {myQuestionsCount}
        </span>
      </button>
      {!isAttendee && (
        <button
          onClick={() => setActiveState(3)}
          className={cn(
            "px-2 py-4 flex items-center gap-x-1 text-sm",
            activeState === 3 && "text-basePrimary border-b border-basePrimary"
          )}
        >
          <p>Awaiting Review</p>
          <span className="text-xs font-medium px-2 py-1 flex items-center justify-center rounded-full bg-basePrimary text-white">
            {awaitingReviewCount}
          </span>
        </button>
      )}

      <div className="flex items-center gap-x-3">
        {!isAttendee && (
          <button onClick={onClose}>
            <Settings size={22} />
          </button>
        )}
        <Select
          onValueChange={(value) => setFilterValue(value)}
          defaultValue={filterValue}
        >
          <SelectTrigger className="h-11 w-[180px]">
            <SelectValue placeholder="Select Filter" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              {filters.map(({ value, label }, index) => (
                <SelectItem
                  key={index}
                  className="h-12 items-center justify-start focus:bg-gray-100"
                  value={value}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      </div>

      {isOpen && (
        <EventQaSetting
          close={onClose}
          eventAlias={eventAlias}
          eventQa={qa}
          refetch={refetch}
        />
      )}
    </div>
  );
}
