
"use client"

import { CalendarDateFill } from "@styled-icons/bootstrap/CalendarDateFill";
import { TimeFive } from "@styled-icons/boxicons-solid/TimeFive";
import { LocationDot } from "@styled-icons/fa-solid/LocationDot";
import { AboutWidget } from "@/components/composables";
import Image from "next/image";
import { saveCookie } from "@/hooks";
import {useFormatEventData} from "@/hooks"
import { Event } from "@/types";

export function EventWidget({ event }: { event: Event }) {
   
    const { startDate, endDate, startTime, endTime, removeComma } =
      useFormatEventData(event);
  
    function gotToEvent() {
      saveCookie("currentEvent", {
        eventId: event?.id,
        eventName: event?.eventTitle,
      });
      window.open(`/event/${event?.id}/home`);
    }
    return (
      <div
        role="button"
        onClick={gotToEvent}
        className="w-full border border-gray-200 px-3 py-8 xl:py-3 rounded-lg flex items-center gap-x-3"
      >
        {event?.eventPoster ? (
          <Image
            src={event?.eventPoster}
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
  