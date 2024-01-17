"use client";

import { Button } from "@/components";
import { ThreeDotsVertical } from "styled-icons/bootstrap";
import { CalendarDateFill } from "@styled-icons/bootstrap/CalendarDateFill";
import { TimeFive } from "@styled-icons/boxicons-solid/TimeFive";
import { LocationDot } from "@styled-icons/fa-solid/LocationDot";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { Users } from "@styled-icons/fa-solid/Users";
import { Dot } from "@styled-icons/bootstrap/Dot"
import { useState, useMemo } from "react";
import { AboutWidget, EventLocationType } from "@/components/composables";
import { Event } from "@/types";
import { DeleteEventModal } from "..";
import { formatDate, formatTime, dateFormatting } from "@/utils";
import { useDuplicateEvent } from "@/hooks";

export function EventCard({ event, refetch }: { refetch: () => Promise<any>, event: Event }) {
  const [isAction, setAction] = useState(false);

  function onClose() {
    setAction((prev) => !prev);
  }


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
  const endTime = useMemo(
    () => formatTime(event?.endDateTime ?? "0"),
    [event?.endDateTime ?? "0"]
  );

  const createdAt = useMemo(
    () => dateFormatting(event?.createdAt ?? "0"),
    [event?.createdAt ?? "0"]
  );


  const removeComma = useMemo(() => {
    return event.eventCity === null || event.eventCountry === null;
  }, [event.eventCity, event.eventCountry])
  return (
    <div className="border flex flex-col gap-y-6 rounded-lg p-3 sm:p-4 shadow-md w-full">
      <div className="w-full flex items-center justify-between">
        <p className="font-medium text-lg">{event?.eventTitle ?? ""}</p>
        <div className="flex items-center gap-x-2">
          <Button
            onClick={onClose}
            className="relative px-0 h-10 bg-transparent"
          >
            <ThreeDotsVertical size={20} />
            {isAction && <ActionModal refetch={refetch} close={onClose} id={event?.id} />}
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col text-[13px] gap-y-1 items-start justify-start">
        <AboutWidget
          Icon={CalendarDateFill}
          text={`${startDate} – ${endDate}`}
        />
        <AboutWidget Icon={TimeFive} text={`${startTime} - ${endTime}`} />
        <AboutWidget Icon={LocationDot} text={<p className="flex items-center ">
          {`${event?.eventCity ?? ""}`}{!removeComma && <span>,</span>}
          <span className="ml-1">{`${event?.eventCountry ?? ""}`}</span></p>} />
        <AboutWidget
          Icon={Users}
          text={<p className="flex items-center ">
            <span>{`${event.expectedParticipants ?? 0} participants`}</span>

            {event?.registered !== null && <Dot size={22} />}
            {event?.registered !== null && <span className="text-xs font-medium  text-zikoro">{`${event?.registered.toLocaleString() ?? ""} registered`}</span>}
          </p>}
        />
      </div>

      <div className="flex items-center justify-between w-full">
        {Array.isArray(event?.pricing) && <p className="font-medium">{`₦${(
          event?.pricing[1]?.Standard || 0
        ).toLocaleString()}`}</p>}
        <div className="flex items-center gap-x-2">
          <EventLocationType locationType={event.locationType} />
          <div className="flex text-xs text-gray-500 flex-col items-start justify-start">
            <p>{event.published ? "Published" : "Draft"}</p>
            <p>{createdAt}</p>
          </div>
        </div>
      </div>
    </div >
  );
}

function ActionModal({ close, id, refetch }: { refetch: () => Promise<any>, close: () => void; id: number }) {
  const { duplicateEvent, loading } = useDuplicateEvent();
  const [isDeleteModal, openDeleteModal] = useState(false);

  function onClose() {
    openDeleteModal((prev) => !prev);
  }

  async function duplicate() {
    await duplicateEvent(id);
    refetch()
    close();
  }
  return (
    <>
      <div className="absolute right-0 top-10  w-[120px]">
        <Button className="fixed inset-0 bg-none h-full w-full z-[100"></Button>
        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex relative z-[50]  flex-col py-4 items-start justify-start bg-white rounded-lg w-full h-fit shadow-lg"
        >
          <Button
            onClick={() => {
              onClose();

            }}
            className="items-center h-10 w-full text-red-600 hover:bg-gray-100 justify-start text-xs"
          >
            Delete
          </Button>
          <Button
            onClick={duplicate}
            className={
              "items-center h-10 gap-x-2 hover:bg-gray-100 justify-start w-full  text-xs"
            }
          >
            {loading && <LoaderAlt size={12} className="animate-spin" />}
            <span>Duplicate</span>
          </Button>
        </div>
      </div>

      {isDeleteModal && <DeleteEventModal refetch={refetch} close={onClose} id={id} />}
    </>
  );
}
