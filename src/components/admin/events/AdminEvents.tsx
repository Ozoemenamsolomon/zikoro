"use client";

import { useGetQueries } from "@/hooks";
import { EventLayout } from "./_components";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { Button } from "@/components";
import { ThreeDotsVertical } from "styled-icons/bootstrap";
import { CalendarDateFill } from "@styled-icons/bootstrap/CalendarDateFill";
import { TimeFive } from "@styled-icons/boxicons-solid/TimeFive";
import { LocationDot } from "@styled-icons/fa-solid/LocationDot";
import { Users } from "@styled-icons/fa-solid/Users";
import { Dot } from "@styled-icons/bootstrap/Dot";
import { Edit } from "@styled-icons/boxicons-solid/Edit";
import { AboutWidget, EventLocationType } from "@/components/composables";
import { Event } from "@/types";
import { PreviewModal } from "../../contents/_components/modal/PreviewModal";
import { useMemo, useState } from "react";
import { useFormatEventData, useUpdateEvent, getCookie } from "@/hooks";
import { Download } from "@styled-icons/bootstrap/Download";
import { Eye } from "@styled-icons/feather/Eye";
import { useSearchParams } from "next/navigation";
import { EmptyCard } from "../../composables";

export default function AdminEvents() {
  const {
    data,
    refetch,
    loading,
  }: { data: Event[]; refetch: () => Promise<any>; loading: boolean } =
    useGetQueries("events");
  const search = useSearchParams();
  const query = search.get("e");

  const eventData = useMemo(() => {
    if (query === "review" || !query) {
      return data?.filter(({ eventStatus }) => eventStatus === "review");
    } else {
      return data?.filter(({ eventStatus }) => eventStatus === query);
    }
  }, [data, query]);

  return (
    <EventLayout>
      {loading && (
        <div className="w-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={50} className="animate-spin" />
        </div>
      )}
      {!loading && Array.isArray(eventData) && eventData?.length === 0 && (
        <EmptyCard text={`No Event`} />
      )}
      {!loading && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center w-full h-full xl:grid-cols-3">
          {Array.isArray(eventData) &&
            eventData?.map((event) => (
              <EventCard
                key={event?.id}
                refetch={refetch}
                event={event}
                query={query}
              />
            ))}
        </div>
      )}
    </EventLayout>
  );
}

function EventCard({
  event,
  query,
  refetch,
}: {
  refetch: () => Promise<any>;
  event: Event;
  query: string | null;
}) {
  const { loading: updating, update } = useUpdateEvent();
  const [isOpen, setOpen] = useState(false);
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
    setOpen((prev) => !prev);
  }

  async function publishEvent() {
    const userData = getCookie("user");
    const statusDetail = {
      createdAt: new Date().toISOString(),
      status: "published",
      user: userData?.email,
    };
    await update(
      {
        ...event,
        eventStatus: "published",
        eventStatusDetails:
          event?.eventStatusDetails && event?.eventStatusDetails !== null
            ? [...event?.eventStatusDetails, statusDetail]
            : [statusDetail],
      },
      String(event?.id)
    );
    refetch();
  }

  // geeting the publisher name
  const publisher: string | undefined = useMemo(() => {
    const publishedObj = event?.eventStatusDetails?.find(
      ({ status }) => status === "published"
    );
    return publishedObj?.user;
  }, [event]);
  return (
    <>
      <div
        role="button"
        //   onClick={goToEvent}
        className="border flex flex-col gap-y-6 bg-white rounded-lg p-3 sm:p-4  w-full"
      >
        <div className="w-full flex items-center justify-between">
          <p className="font-medium text-lg line-clamp-1">
            {event?.eventTitle ?? ""}
          </p>
          <div className="flex items-center gap-x-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                //  onClose();
              }}
              className="relative px-0 h-10 bg-transparent"
            >
              <ThreeDotsVertical size={20} />
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

                {event?.registered !== null && <Dot size={22} />}
                {event?.registered !== null && (
                  <span className="text-xs font-medium  text-basePrimary">{`${
                    event?.registered.toLocaleString() ?? ""
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
        {query === "review" && (
          <div className="py-4 w-full border-t  p-4 flex items-center gap-x-2">
            <Button
              // type="submit"
              onClick={onClose}
              className="text-gray-50 bg-basePrimary gap-x-2"
            >
              <Eye size={22} />
              <p>Preview</p>
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                publishEvent();
              }}
              type="submit"
              className="text-basePrimary border border-basePrimary gap-x-2"
            >
              <Download size={22} />
              <p>Publish</p>
              {updating && <LoaderAlt size={22} className="animate-spin" />}
            </Button>
          </div>
        )}
        {query === "published" && (
          <div className="py-4 w-full border-t  p-4 flex items-center gap-x-2">
            <p className="text-gray-500">{`Published By ${publisher ?? ""}`}</p>
          </div>
        )}
      </div>
      {isOpen && <PreviewModal close={onClose} eventDetail={event} />}
    </>
  );
}
