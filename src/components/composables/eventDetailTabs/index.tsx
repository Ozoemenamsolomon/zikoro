"use client"

import { useState } from "react";
import { Button } from "@/components";
import { cn } from "@/lib";
import { Event, EventDetailTab } from "@/types";
import { About, Speakers, Sponsors, Agenda } from "..";

export function EventDetailTabs({
  className,
  aboutClassName,
  event,
}: {
  event: Event | null;
  className?: string;
  aboutClassName?: string;
}) {
  const [active, setActive] = useState(1);

  const tabs = [
    { id: 1, name: "About" },
    { id: 2, name: "Speakers" },
    { id: 3, name: "Agenda" },
    { id: 4, name: "Partners" },
  ];
  return (
    <>
      <div
        className={cn(
          "flex px-4 w-full sm:px-6 items-center gap-x-2 my-4 border-b sm:my-6 sm:gap-x-6",
          className
        )}
      >
        {tabs.map(({ id, name }) => (
          <Button
            key={name}
            onClick={() => setActive(id)}
            className={cn(
              "px-2 py-2 h-fit bg-transparent rounded-none text-sm sm:text-xl font-medium text-gray-500",
              active === id && "border-b-2 border-zikoro text-zikoro"
            )}
          >
            {name}
          </Button>
        ))}
      </div>

      {active === EventDetailTab.ABOUT_TAB && <About event={event} className={aboutClassName} />}
      {active === EventDetailTab.SPEAKERS_TAB && <Speakers />}
      {active === EventDetailTab.AGENDA_TAB && <Agenda />}
      {active === EventDetailTab.EXIHIBITORS_TAB && event && <Sponsors event={event} />}
    </>
  );
}
