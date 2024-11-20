"use client";

import { Button } from "@/components";
import { cn } from "@/lib";

import { useState, useMemo } from "react";
import { Event } from "@/types";

import { useAttenedeeEvents } from "@/hooks";
import { NavigateNext } from "@styled-icons/material-rounded/NavigateNext";
import { AllDatas, EventWidget } from "..";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import useDisclose from "@/hooks/common/useDisclose";

export function UserEvents() {
  const [active, setActive] = useState(1);
  const { registeredEvents, isLoading } = useAttenedeeEvents();
  const { isOpen, onOpen, onClose } = useDisclose();

  const now = new Date();

  const eventList: Event[] | undefined = useMemo(() => {
    if (registeredEvents && active === 2) {
      return registeredEvents?.filter((val) => {
        const eventDate = new Date(val?.startDateTime);

        return eventDate < now;
      }).sort((a, b) => {
        
        const startDateA = new Date(a.startDateTime).getTime();
        const startDateB = new Date(b.startDateTime).getTime();
        return startDateA - startDateB;
      })
    } else {
      return registeredEvents?.filter((val) => {
        const eventDate = new Date(val?.startDateTime);

        return eventDate > now;
      }).sort((a, b) => {
       
        const startDateA = new Date(a.startDateTime).getTime();
        const startDateB = new Date(b.startDateTime).getTime();
        return startDateA - startDateB;
      })
    }
  }, [registeredEvents, active]);
  const tab = [
    {
      id: 1,
      title: "Upcoming Events",
    },
    {
      id: 2,
      title: "Past Events",
    },
  ];
  return (
    <>
      <div className="w-full xl:col-span-3 h-full bg-white rounded-lg border">
        <div className="w-full grid grid-cols-2 h-fit border-b items-center ">
          {tab?.map(({ title, id }) => (
            <Button
              onClick={() => setActive(id)}
              className={cn(
                "rounded-none w-full",
                active === id &&
                  "rounded-t-lg text-basePrimary border-basePrimary border bg-basePrimary/10 rounded-b-none"
              )}
            >
              {title}
            </Button>
          ))}
        </div>
        <div className="w-full flex flex-col p-4 gap-y-3">
          {isLoading && (
            <div className="w-full col-span-full h-[400px] flex items-center justify-center">
              <LoaderAlt size={24} className="animate-spin" />
            </div>
          )}
          {!isLoading &&
            Array.isArray(eventList) &&
            eventList?.length === 0 && (
              <div className="w-full col-span-full h-[400px] flex items-center justify-center">
                <p className="font-semibold"> No Event </p>
              </div>
            )}

          {Array.isArray(eventList) &&
            eventList
              ?.slice(0, 3)
              ?.map((event) => <EventWidget key={event?.id} event={event} />)}
        </div>

        {Array.isArray(eventList) && eventList?.length > 3 && (
          <div className="w-full flex col-span-full pb-2 items-end justify-end mt-10">
            <button
              onClick={onOpen}
              className="flex items-center gap-x-1 text-basePrimary"
            >
              <p className="text-mobile sm:text-sm">See All</p>
              <NavigateNext size={20} />
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <AllDatas
          data={eventList}
          onClose={onClose}
          title={tab[active]?.title}
        />
      )}
    </>
  );
}
