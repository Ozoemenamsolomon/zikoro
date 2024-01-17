"use client"

import { Button } from "@/components";
import { cn } from "@/lib";
import { Event, EventDetailTab } from "@/types";
import { useState } from "react";
import { About, Agenda, Exhibitors, SingleEvent, Speakers } from "..";

export function EventDetail({event}:{event:Event}) {
  const [active, setActive] = useState(1);

  const tabs = [
    { id: 1, name: "About" },
    { id: 2, name: "Speakers" },
    { id: 3, name: "Agenda" },
    { id: 4, name: "Partners" },
  ];
  return (
    <div className="bg-white rounded-2xl shadow ">
      <SingleEvent
        isDetail={true}
        event={event}
        useDiv={true}
        className="w-full bg-none  shadow-none"
      />

      <div className="flex px-4 sm:px-6 items-center gap-x-2 my-4 border-b sm:my-6 sm:gap-x-6">
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

      {active === EventDetailTab.ABOUT_TAB && <About />}
      {active === EventDetailTab.SPEAKERS_TAB && <Speakers />}
      {active === EventDetailTab.AGENDA_TAB && <Agenda />}
      {active === EventDetailTab.EXIHIBITORS_TAB && <Exhibitors />}
    </div>
  );
}
