"use client";

import { Button } from "@/components";
import { cn } from "@/lib";
import { Event, EventDetailTab } from "@/types";

import { About, Speakers, Sponsors, EventAgendas } from "..";
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
  isEventHome,
}: {
  event: Event | null;
  className?: string;
  isEventDetailPage?: boolean;
  aboutClassName?: string;
  active: number;
  setActiveTab: (n: number) => void;
  isEventHome?: boolean;
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

  const itemTabs = isEventHome
    ? [
        { status: true, title: "About" },
        { status: true, title: "Agenda" },
        { status: true, title: "Speakers" },
        { status: true, title: "Partners" },
      ]
    : selectedTabs;

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
          "sm:flex hidden px-4  w-full sm:px-6 items-center gap-x-2 mb-4 border-b sm:mb-6 sm:gap-x-6",
          className,
          isEventDetailPage && "flex bg-white justify-center pt-2 border-y"
        )}
      >
        {itemTabs.map(({ title, status }, id) => (
          <Button
            key={title}
            onClick={() => setActiveTab(id + 1)}
            className={cn(
              "px-2 py-2 h-fit bg-transparent rounded-none text-sm sm:text-base font-medium text-gray-500 hidden",
              active === id + 1 &&
                "border-b-2 border-basePrimary text-basePrimary",
              status && "block"
            )}
          >
            {title}
          </Button>
        ))}
      </div>

      <div
        className={cn(
          "w-full",
          isEventDetailPage &&
            "mx-auto bg-white mt-4 rounded-lg py-3 sm:mt-6 w-full sm:w-[65%] lg:w-[90%] xl:w-[80%]"
        )}
      >
        {active === EventDetailTab.ABOUT_TAB && (
          <About
            isEventDetailPage={isEventDetailPage}
            event={event}
            isEventHome={isEventHome}
            className={aboutClassName}
          />
        )}
        {active === EventDetailTab.SPEAKERS_TAB && event && (
          <Speakers
            eventId={String(event.eventAlias)}
           // changeMajorActiveState={changeActiveState}
          />
        )}
        {active === EventDetailTab.AGENDA_TAB && event && (
          <EventAgendas eventId={String(event?.eventAlias)} />
        )}
        {active === EventDetailTab.EXIHIBITORS_TAB && event && (
          <Sponsors event={event} changeMajorActiveState={changeActiveState} />
        )}
      </div>
    </>
  );
}
