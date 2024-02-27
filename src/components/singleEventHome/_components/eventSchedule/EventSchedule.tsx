"use client";

import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import { Button } from "@/components";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AboutWidget } from "@/components/composables";
import { CalendarDateFill } from "@styled-icons/bootstrap/CalendarDateFill";
import { LocationDot } from "@styled-icons/fa-solid/LocationDot";
import { useMemo } from "react";
import { Event } from "@/types";
import { formatDate } from "@/utils";
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

  return (
    <div className="w-full flex flex-col gap-y-4 items-start justify-start ">
      {event?.eventPoster && (
        <div className="w-full">
          <Image
            className="w-full h-28 sm:h-64 rounded-none object-cover"
            src={event?.eventPoster ? event?.eventPoster?.image1 : ""}
            alt="eventimage"
            width={700}
            height={700}
          />
        </div>
      )}

      <h1 className="px-4 font-semibold text-2xl">{event?.eventTitle ?? ""}</h1>
      {event && (
        <div className="flex px-4 items-center justify-between w-full">
          <AboutWidget
            Icon={CalendarDateFill}
            text={`${startDate} – ${endDate}`}
          />
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
