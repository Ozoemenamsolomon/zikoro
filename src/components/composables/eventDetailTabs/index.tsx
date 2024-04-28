"use client";

import { Button } from "@/components";
import { cn } from "@/lib";
import { Event, EventDetailTab } from "@/types";

import { About, Speakers, Sponsors, Agenda } from "..";
import { EventDetailMobileTab } from "./EventDetailMobileTab";
import { useEffect, useState } from "react";

const eventWebsiteSettings = [
  { title: "Logo", status: false },
  { title: "Banner", status: true },
  { title: "Agenda", status: true },
  { title: "Speakers", status: true },
  { title: "Partners", status: true },
  { title: "Reviews", status: true },
];

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
  const [selectedTabs, setSelectedTabs] = useState<
    { title: string; status: boolean }[]
  >([]);
  const tabs = [
    { id: 1, name: "About" },
    { id: 2, name: "Agenda" },
    { id: 3, name: "Speakers" },
    { id: 4, name: "Partners" },
  ];

  useEffect(() => {
    if (event) {
      if (event?.eventWebsiteSettings === null) {
        const updated = tabs
          .map((tab) => {
            const matchingSetting = eventWebsiteSettings.find(
              (setting) => setting.title === tab.name
            );
            return matchingSetting
              ? { title: matchingSetting.title, status: matchingSetting.status }
              : null;
          })
          .filter(
            (tab): tab is { title: string; status: boolean } => tab !== null
          );

        if (updated)
          setSelectedTabs([{ title: "About", status: true }, ...updated]);
      } else {
        const updated = tabs
          .map((tab) => {
            const matchingSetting = event?.eventWebsiteSettings.find(
              (setting) => setting.title === tab.name
            );
            return matchingSetting
              ? { title: matchingSetting.title, status: matchingSetting.status }
              : null;
          })
          .filter(
            (tab): tab is { title: string; status: boolean } => tab !== null
          );
        if (updated)
          setSelectedTabs([{ title: "About", status: true }, ...updated]);
      }
    }
  }, [event]);
  function changeActiveState(active: number) {
    setActiveTab(active);
  }
  return (
    <>
      {!isEventDetailPage && active === 1 && event && (
        <EventDetailMobileTab
          eventId={String(event.eventAlias)}
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
        {selectedTabs.map(({ title, status }, id) => (
          <Button
            key={title}
            onClick={() => setActiveTab(id + 1)}
            className={cn(
              "px-2 py-2 h-fit bg-transparent rounded-none text-sm sm:text-xl font-medium text-gray-500 hidden",
              active === id + 1 &&
                "border-b-2 border-basePrimary text-basePrimary",
              status && "block"
            )}
          >
            {title}
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
