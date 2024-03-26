"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { TimeFive } from "@styled-icons/boxicons-solid/TimeFive";
import { AboutWidget } from "@/components/composables";
import { CalendarDateFill } from "@styled-icons/bootstrap/CalendarDateFill";
import { LocationDot } from "@styled-icons/fa-solid/LocationDot";
import { useMemo } from "react";
import { Event } from "@/types";
import { formatDate, formatTime } from "@/utils";
import { CountDown } from "..";
export function EventSchedule({ event }: { event: Event | null }) {
  const router = useRouter();

  const removeComma = useMemo(() => {
    return event?.eventCity === null || event?.eventCountry === null;
  }, [event?.eventCity, event?.eventCountry]);

  const startDate = useMemo(
    () => formatDate(event?.startDateTime ?? "0"),
    [event?.startDateTime ?? "0"]
  );
  const endDate = useMemo(
    () => formatDate(event?.endDateTime ?? "0"),
    [event?.endDateTime ?? "0"]
  );
  const startTime = useMemo(
    () => formatTime(event?.startDateTime ?? "0"),
    [event?.startDateTime ?? "0"]
  );

  return (
    <div className="w-full flex flex-col gap-y-4 items-start justify-start ">
      {Array.isArray(event?.eventPoster) && event?.eventPoster?.length > 0 ? (
        <div className="w-full">
          <Image
            className="w-full h-28 sm:h-64 rounded-none object-cover"
            src={event?.eventPoster[0]}
            alt="eventimage"
            width={700}
            height={700}
          />
        </div>
      ) : (
        <div className=" w-full h-28 sm:h-64 rounded-none  animate-pulse">
          <div className="w-full h-full bg-gray-200"></div>
        </div>
      )}

      <h1 className="px-4 font-semibold text-2xl">{event?.eventTitle ?? ""}</h1>
      {event && (
        <div className="flex px-4 items-start justify-between w-full">
          <div className="flex flex-col gap-y-1 items-start justify-start">
            <AboutWidget
              Icon={CalendarDateFill}
              text={ <p className="flex items-center gap-x-1">
              {`${startDate} `}{" "}
              <span className="hidden md:block">{`- ${endDate}`}</span>
            </p>}
            />
            <AboutWidget
              Icon={TimeFive}
              text={`${startTime} (${event?.eventTimeZone ?? ""})`}
            />
          </div>
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
      )}

      {event?.startDateTime && <CountDown startDate={event?.startDateTime} />}
    </div>
  );
}
