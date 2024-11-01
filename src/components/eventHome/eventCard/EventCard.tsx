"use client";

import { Button } from "@/components";
import { ThreeDotsVertical } from "styled-icons/bootstrap";
import { CalendarDateFill } from "styled-icons/bootstrap";
import { TimeFive } from "styled-icons/boxicons-solid";
import { LocationDot } from "styled-icons/fa-solid";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { Users } from "styled-icons/fa-solid";
import { Dot } from "styled-icons/bootstrap";
import { Edit } from "styled-icons/boxicons-solid";
import { useMemo, useState } from "react";
import { AboutWidget, EventLocationType } from "@/components/composables";
import { TOrgEvent } from "@/types";
import { DeleteEventModal } from "..";
import { getCookie, useDuplicateEvent, useFormatEventData } from "@/hooks";
import { saveCookie } from "@/hooks";
import { useRouter } from "next/navigation";
import { ExternalLink } from "styled-icons/remix-fill";
export function EventCard({
  event,
  refetch,
}: {
  refetch: () => Promise<any>;
  event: TOrgEvent;
}) {
  const [isAction, setAction] = useState(false);
  const router = useRouter();
  const {
    startDate,
    endDate,
    startTime,
    endTime,
    currency,
    removeComma,
    createdAt,
    price,
  } = useFormatEventData(event);

  function onClose() {
    setAction((prev) => !prev);
  }

  function goToEvent() {
    saveCookie("currentEvent", {
      eventId: event?.id,
      eventAlias: event?.eventAlias,
      eventName: event?.eventTitle,
      startDate: event?.startDateTime,
    });
    saveCookie("event", event);
    router.push(`/event/${event?.eventAlias}/content/info`);
  }

  const registeredAttendees = useMemo(() => {
      if (event && event.attendees) {

        return event.attendees?.filter((a) => !a?.archive).length
      }
      else {
        return null
      }
  },[event])

  return (
    <div
      role="button"
      onClick={goToEvent}
      className="border flex flex-col gap-y-6 bg-white rounded-lg p-3 sm:p-4  w-full"
    >
      <div className="w-full flex items-center justify-between">
        <p className="font-medium text-lg line-clamp-1">
          {event?.eventTitle ?? ""}
        </p>
        <div className="flex items-center gap-x-2">
          {event?.published && (
            <Button
              onClick={() =>
                window.open(`/live-events/${event?.eventAlias}`, "_blank")
              }
              className="px-0 w-fit h-fit"
            >
              <ExternalLink size={20} />
            </Button>
          )}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="relative px-0 h-10 bg-transparent"
          >
            <ThreeDotsVertical size={20} />
            {isAction && (
              <ActionModal
                isPublished={event.published}
                refetch={refetch}
                close={onClose}
                id={event?.id}
              />
            )}
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col text-[13px] gap-y-1 items-start justify-start">
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
        <AboutWidget
          Icon={Users}
          text={
            <p className="flex items-center ">
              <span>{`${event.expectedParticipants ?? 0} participants`}</span>

              {registeredAttendees !== null && <Dot size={22} />}
              {registeredAttendees !== null && (
                <span className="text-xs font-medium  text-basePrimary">{`${
                  registeredAttendees.toLocaleString() ?? ""
                } registered`}</span>
              )}
            </p>
          }
        />
      </div>

      <div className="flex items-center justify-between w-full">
        {Array.isArray(event?.pricing) && event?.pricing?.length > 0 ? (
          <p className="font-medium">{`${
            currency ? currency : "₦"
          }${price}`}</p>
        ) : (
          <p className="w-1 h-1"></p>
        )}

        <div className="flex items-center gap-x-2">
          <EventLocationType locationType={event.locationType} />
          <div className="flex text-xs text-gray-500 flex-col items-start justify-start">
            <p>
              {event.published ? (
                "Published"
              ) : (
                <button className="flex items-center gap-x-1">
                  <Edit size={16} />
                  <span>Edit</span>
                </button>
              )}
            </p>
            <p>{createdAt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionModal({
  close,
  id,
  refetch,
  isPublished,
}: {
  refetch: () => Promise<any>;
  close: () => void;
  isPublished: boolean;
  id: number;
}) {
  const { duplicateEvent, loading } = useDuplicateEvent();
  const org = getCookie("currentOrganization");
  const [isDeleteModal, openDeleteModal] = useState(false);

  // console.log("org", org)

  function onClose() {
    openDeleteModal((prev) => !prev);
  }

  async function duplicate() {
    await duplicateEvent(id);
    refetch();
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
            className="items-center rounded-none h-10 w-full text-red-600 hover:bg-gray-100 justify-start text-xs"
          >
            Delete
          </Button>
          <Button
            onClick={duplicate}
            className={
              "items-center rounded-none h-10 gap-x-2 hover:bg-gray-100 justify-start w-full  text-xs"
            }
          >
            {loading && <LoaderAlt size={12} className="animate-spin" />}
            <span>Duplicate</span>
          </Button>
        </div>
      </div>

      {isDeleteModal && (
        <DeleteEventModal
          isPublished={isPublished}
          refetch={refetch}
          close={onClose}
          id={id}
        />
      )}
    </>
  );
}
