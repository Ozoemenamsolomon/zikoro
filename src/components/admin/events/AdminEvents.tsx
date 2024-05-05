"use client";

import { useGetEvents } from "@/hooks";
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
import { TOrgEvent } from "@/types";
import { PublishCard } from "@/components/composables";
import { PreviewModal } from "../../contents/_components/modal/PreviewModal";
import { useMemo, useState } from "react";
import { useFormatEventData, usePublishEvent, getCookie } from "@/hooks";
import { Download } from "@styled-icons/bootstrap/Download";
import { Eye } from "@styled-icons/feather/Eye";
import { useSearchParams } from "next/navigation";
import { EmptyCard } from "../../composables";

export default function AdminEvents() {
  const { events, getEvents: refetch, isLoading: loading } = useGetEvents();
  const search = useSearchParams();
  const query = search.get("e");

  const eventData = useMemo(() => {
    if (query === "review" || query === null) {
      return events?.filter(({ eventStatus }) => eventStatus === "review");
    } else {
      return events?.filter(({ eventStatus }) => eventStatus === query);
    }
  }, [events, query]);

  return (
    <EventLayout>
      {loading && (
        <div className="w-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
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
  event: TOrgEvent;
  query: string | null;
}) {
  const { isLoading: updating, publishEvent: update } = usePublishEvent();
  const [isShowPublishModal, setShowPublishModal] = useState(false);
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
      user: userData?.userEmail,
    };

    const { organization, ...remainingData }: any = event;
    await update({
      payload: {
        ...remainingData,
        published: true,
        eventStatus: "published",
        eventStatusDetails:
          event?.eventStatusDetails && event?.eventStatusDetails !== null
            ? [...event?.eventStatusDetails, statusDetail]
            : [statusDetail],
      },
      eventId: String(event?.eventAlias),
      email: event?.organization?.eventContactEmail

    });
    refetch();
  }

  function showPublishModal() {
    setShowPublishModal((prev) => !prev);
  }

  // get the publisher name
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
        {(query === "review" || query === null) && (
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
                showPublishModal();
              }}
              type="submit"
              className="text-basePrimary border border-basePrimary gap-x-2"
            >
              <Download size={22} />
              <p>Publish</p>
            </Button>
          </div>
        )}
        {query === "published" && (
          <div className="py-4 w-full border-t flex-col  p-4 flex items-start justify-start gap-x-2">
            <p>Published By</p>
            <p className="text-gray-500 w-full text-ellipsis overflow-hidden whitespace-nowrap">{` ${
              publisher ?? ""
            }`}</p>
          </div>
        )}
      </div>
      {isShowPublishModal && (
        <PublishCard
          asyncPublish={publishEvent}
          close={showPublishModal}
          loading={updating}
          message={`Are you sure you want to publish this event?.`}
        />
      )}
      {isOpen && <PreviewModal close={onClose} eventDetail={event} />}
    </>
  );
}
