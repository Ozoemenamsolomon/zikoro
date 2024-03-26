"use client";

import { Button } from "@/components";
import { cn } from "@/lib";
import { Event, EventDetailTab } from "@/types";

import { About, Speakers, Sponsors, Agenda } from "..";
import { EventDetailMobileTab } from "./EventDetailMobileTab";

export function EventDetailTabs({
  className,
  aboutClassName,
  event,
  isEventDetailPage,
  active,
  setActiveTab,
}: {
  event: Event | null;
  className?: string;
  isEventDetailPage?: boolean;
  aboutClassName?: string;
  active: number;
  setActiveTab: (n: number) => void;
}) {
  const tabs = [
    { id: 1, name: "About" },
    { id: 2, name: "Agenda" },
    { id: 3, name: "Speakers" },
    { id: 4, name: "Partners" },
  ];

  function changeActiveState(active: number) {
    setActiveTab(active);
  }
  return (
    <>
      {!isEventDetailPage && active === 1 && event && (
        <EventDetailMobileTab
          eventId={String(event.id)}
          changeActiveState={changeActiveState}
        />
      )}
      <div
        className={cn(
          "sm:flex hidden px-4  w-full sm:px-6 items-center gap-x-2 my-4 border-b sm:my-6 sm:gap-x-6",
          className,
          isEventDetailPage && "flex"
        )}
      >
        {tabs.map(({ id, name }) => (
          <Button
            key={name}
            onClick={() => setActiveTab(id)}
            className={cn(
              "px-2 py-2 h-fit bg-transparent rounded-none text-sm sm:text-xl font-medium text-gray-500",
              active === id && "border-b-2 border-basePrimary text-basePrimary"
            )}
          >
            {name}
          </Button>
        ))}
      </div>

      {active === EventDetailTab.ABOUT_TAB && (
        <About
          isEventDetailPage={isEventDetailPage}
          event={event}
          className={aboutClassName}
        />
      )}
      {active === EventDetailTab.SPEAKERS_TAB && (
        <Speakers changeMajorActiveState={changeActiveState} />
      )}
      {active === EventDetailTab.AGENDA_TAB && <Agenda />}
      {active === EventDetailTab.EXIHIBITORS_TAB && event && (
        <Sponsors event={event} changeMajorActiveState={changeActiveState} />
      )}
    </>
  );
}
