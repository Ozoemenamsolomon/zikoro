"use client";

import { Button } from "@/components";
import { cn } from "@/lib";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Event } from "@/types";
import { CalendarDateFill } from "@styled-icons/bootstrap/CalendarDateFill";
import { TimeFive } from "@styled-icons/boxicons-solid/TimeFive";
import { LocationDot } from "@styled-icons/fa-solid/LocationDot";
import { AboutWidget } from "@/components/composables";
import { useFormatEventData, useAttenedeeEvents } from "@/hooks";
import { NavigateNext } from "@styled-icons/material-rounded/NavigateNext";
import Link from "next/link";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { saveCookie } from "@/hooks";

export function UserEvents() {
  const [active, setActive] = useState(1);
  const { registeredEvents, isLoading } = useAttenedeeEvents();
 
  const now = new Date();

  const eventList = useMemo(() => {
    if (registeredEvents && active === 1) {
      return registeredEvents?.filter((val) => {
        const eventDate = new Date(val?.startDateTime);

        return eventDate < now;
      });
    } else {
      return registeredEvents?.filter((val) => {
        const eventDate = new Date(val?.startDateTime);

        return eventDate > now;
      });
    }
  }, [registeredEvents, active]);
  const tab = [
    {
      id: 1,
      title: "Past Events",
    },
    {
      id: 2,
      title: "Upcoming Events",
    },
  ];
  return (
    <div className="w-full xl:col-span-3 bg-white rounded-lg border">
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
      {isLoading && 
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={24} className="animate-spin"/>
        </div>
        }
        {!isLoading &&  Array.isArray(registeredEvents) && registeredEvents?.length === 0 && 
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
        <p>- No Event -</p>
      </div>
        }
        
        {Array.isArray(eventList) &&
          eventList
            ?.slice(0, 3)
            ?.map((event) => <Widget key={event?.id} event={event} />)}
      </div>

      <div className="w-full flex col-span-full pb-2 items-end justify-end mt-10">
        <Link href="/events" className="flex items-center gap-x-2 text-basePrimary">
          <p className="text-mobile sm:text-sm">See All</p>
          <NavigateNext size={20} />
        </Link>
      </div>
    </div>
  );
}

function Widget({ event }: { event: Event }) {

  const { startDate, endDate, startTime, endTime, removeComma } =
    useFormatEventData(event);

    function gotToEvent() {
      saveCookie("currentEvent", {eventId: event?.id, eventName: event?.eventTitle})
      window.open(`/event/${event?.id}/content/info`, "_blank")
    }
  return (
    <div
    role="button"
    onClick={gotToEvent}
    className="w-full border border-gray-200 px-3 py-8 xl:py-3 rounded-lg flex items-center gap-x-3">
      {Array.isArray(event?.eventPoster) && event?.eventPoster?.length > 0 ? (
        <Image
          src={event?.eventPoster[0]}
          alt="logo"
          width={300}
          height={200}
          className="rounded-lg w-24 h-24"
        />
      ) : (
        <div className="rounded-lg w-24 h-24 animate-pulse">
          <div className="w-full h-full bg-gray-200"></div>
        </div>
      )}

      <div className="flex flex-col items-start justify-start gap-y-1">
        <p className="font-semibold text-base sm:text-lg">
          {event?.eventTitle ?? ""}
        </p>
        <AboutWidget
          Icon={CalendarDateFill}
          text={`${startDate} – ${endDate}`}
        />
        <AboutWidget Icon={TimeFive} text={`${startTime} - ${endTime}`} />
        <AboutWidget
          Icon={LocationDot}
          text={
            <p className="flex items-center ">
              {`${event?.eventCity ?? ""}`}
              {!removeComma && <span>,</span>}
              <span className="ml-1">{`${event?.eventCountry ?? ""}`}</span>
            </p>
          }
        />
      </div>
    </div>
  );
}
