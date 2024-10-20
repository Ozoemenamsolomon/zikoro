"use client";

import { Button } from "@/components";
import { Eye } from "styled-icons/feather";
import { CloseOutline } from "styled-icons/evaicons-outline";
import { EventLocationType } from "@/components/composables";
import { Link2Outline } from "styled-icons/evaicons-outline";
import { LocationPin } from "styled-icons/entypo";
import { CollapsibleWidget, Duplicate, Edit, Deletes } from ".";
import { FilePdf } from "styled-icons/fa-regular";
import Image from "next/image";
import { TAgenda, Event, TReview, TFeedBack } from "@/types";
import { Player } from "@/components/composables";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, useGetReviews, useUpdateAgenda } from "@/hooks";
import { isEventLive, formatTime, formatLongDate } from "@/utils";
import { BoothStaffWidget } from "@/components/partners/sponsors/_components";
import Link from "next/link";
import useUserStore from "@/store/globalUserStore";
import { FaStar, FaRegStar } from "react-icons/fa";
import { formatDistanceToNowStrict } from 'date-fns';
interface TCalculatedReview {
  average: number;
  rating: number;
  review: TFeedBack[];
}

 function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
  });
}

function Rating({ rating }: { rating: number }) {
  const ratings = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center  gap-x-1">
      {ratings.map((value) => {
        return (
          <button key={value} className="">
            {value <= rating ? (
              <FaStar size={18} className="text-basePrimary" />
            ) : (
              <FaRegStar size={18} />
            )}
          </button>
        );
      })}
    </div>
  );
}

function SessionReviewsModal({
  rating,
  close,
}: {
  close: () => void;
  rating: TCalculatedReview;
}) {
  const aggregateRate = useMemo(() => {
    if (rating?.review?.length <= 3) {
      return `${
        rating?.review?.length === 1
          ? `${rating?.review?.length} Review`
          : "Reviews"
      } `;
    } else {
      return `3 Reviews of ${rating?.review?.length} Total`;
    }
  }, [rating]);


  return (
    <div
      onClick={close}
      className="w-full  fixed inset-0 h-full z-[100]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[95%] max-w-xl m-auto absolute inset-0 bg-white shadow rounded-lg h-fit max-h-[85%] "
      >
        <div className="w-full bg-white h-full rounded-lg flex flex-col p-3 items-start justify-start gap-y-3">
          <div className="w-full flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base sm:text-xl">
              Customer Reviews
            </h2>
            <Button onClick={close}>
              <CloseOutline size={22} />
            </Button>
          </div>

          <div className="w-full p-3 bg-white rounded-lg shadow grid grid-cols-1 gap-y-2">
            <div className="w-full flex items-center gap-x-2">
              <h1 className="font-bold text-2xl sm:text-3xl">
                {rating?.average > 0 ? `${rating?.average}.0` : "0"}
              </h1>
              <Rating rating={rating?.average || 0} />
            </div>
            <div className="text-gray-500 flex mb-2 items-center text-xs sm:text-sm">
              <p>{`(${rating?.rating || 0} Reviews)`}</p>
            </div>

            {[5, 4, 3, 2, 1].map((val, index) => {
              const reviewRate = rating?.review?.filter(
                ({ rating }) => Number(rating) === val
              )?.length;
              return (
                <div
                  key={index}
                  className="w-full items-center grid grid-cols-10"
                >
                  <p className="font-medium">{val}</p>
                  <div className="col-span-9 relative w-full rounded-3xl h-3 bg-gray-200">
                    <span
                      style={{
                        width: reviewRate
                          ? `${(
                              (reviewRate / rating?.review?.length) *
                              100
                            ).toFixed(0)}%`
                          : "0%",
                      }}
                      className="absolute rounded-3xl inset-0 bg-basePrimary h-full"
                    ></span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="w-full font-medium">{aggregateRate}</div>

          <div className="w-full flex flex-col items-start justify-start gap-y-2">
            {rating?.review?.map((rev, index) => (
              <div
                key={index}
                className="w-full bg-white rounded-lg shadow p-3 grid grid-cols-1 gap-y-3"
              >
                 <Rating rating={rev?.rating || 0} />
                 {/* <p className="text-gray-500">{rev?.createdAt ||""}</p> */}
                <p className="text-base sm:text-xl font-medium">{`${
                  rev?.attendees?.firstName
                } ${rev?.attendees?.lastName?.charAt(0)}.`}</p>

                <p className="w-full text-start line-clamp-3 text-xs sm:text-mobile">
                  {rev?.comments ?? ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AboutSession({
  agenda,
  event,
  refetch,
  refetchSession,
  isIdPresent,
  isOrganizer,
}: {
  event: Event | null;
  refetch?: () => Promise<any>;
  refetchSession?: () => Promise<any>;
  agenda: TAgenda | null;
  isIdPresent: boolean;
  isOrganizer: boolean;
}) {
  const [isReviews, setShowReviews] = useState(false);
  const { user } = useUserStore();
  const router = useRouter();
  const { rating, getRating } = useGetReviews();
  const { updateAgenda } = useUpdateAgenda();
  const isLive = useMemo(() => {
    if (agenda) {
      return isEventLive(agenda?.startDateTime, agenda?.endDateTime);
    } else {
      return false;
    }
  }, [agenda?.startDateTime, agenda?.endDateTime]);

  const agendaTime = useMemo(() => {
    if (agenda) {
      const start = formatTime(agenda?.startDateTime || "0");
      const end = formatTime(agenda?.endDateTime || "0");
      return `${start} - ${end}`;
    } else {
      return "";
    }
  }, [agenda?.startDateTime, agenda?.endDateTime]);

  const agendaDate = useMemo(() => {
    if (agenda) {
      return formatLongDate(agenda?.startDateTime);
    } else {
      return "";
    }
  }, [agenda?.startDateTime]);

  useEffect(() => {
    (async () => {
      if (agenda) {
        getRating({ agendaId: agenda?.sessionAlias });
      }
    })();
  }, [agenda]);

  function onReviews() {
    setShowReviews((rev) => !rev);
  }

  useEffect(() => {
    (async () => {
      if (agenda && user) {
        if (
          Array.isArray(agenda?.sessionViewsDetails) &&
          agenda?.sessionViewsDetails?.length > 0
        ) {
          // checking if the current user has viewed the agenda, when the length of agenda is greater than zero
          const isPresent = agenda?.sessionViewsDetails?.some(
            ({ id }) => String(id) === String(user?.id)
          );
          if (!isPresent) {
            // when user has not viewed
            const payload = {
              ...agenda,
              sessionViews: Number(agenda?.sessionViews) + 1,
              sessionViewsDetails: [...agenda?.sessionViewsDetails, user],
            };

            await updateAgenda({ payload });
          }
        } else {
          const payload = {
            ...agenda,
            sessionViews: 1,
            sessionViewsDetails: [user],
          };
          await updateAgenda({ payload });
        }
      }
    })();
  }, [agenda]);

  return (
    <>
      {agenda && event && (
        <div className="w-full lg:col-span-5 border-r">
          {agenda?.sessionUrl && (
            <div className="w-full h-48 sm:h-[25rem] lg:h-[16rem]">
              <Player
                src={agenda?.sessionUrl}
                thumbnail={event?.eventPoster}
                title={agenda?.sessionTitle}
                autoPlay
                load={"eager"}
                streamType={"live"}
              />
            </div>
          )}

          <h2 className="text-base px-4 w-full my-2 text-ellipsis whitespace-nowrap overflow-hidden sm:text-xl font-medium">
            {agenda?.sessionTitle ?? ""}
          </h2>
          <p className="mb-2 px-4 text-gray-500 text-[13px]">
            {` ${agendaDate ?? ""} ${agendaTime ?? ""}`}
          </p>
          <div className="flex px-4 items-center flex-wrap gap-3 mb-2 ">
            {agenda?.sessionType && (
              <EventLocationType locationType={agenda?.sessionType ?? ""} />
            )}
            {agenda?.sessionVenue && (
              <div className="flex items-center gap-x-1">
                <LocationPin size={20} />
                <p>{agenda?.sessionVenue ?? ""}</p>
              </div>
            )}
            <button className="bg-[#F44444]/10 text-xs text-[#F44444] px-2 py-2 rounded-md">
              {agenda?.Track ?? ""}
            </button>
            {agenda?.sessionUrl && (
              <button
                onClick={() => router.push(agenda?.sessionUrl)}
                className="flex items-center gap-x-2"
              >
                <Link2Outline size={18} />
                <p className="text-xs">Join Live Event</p>
              </button>
            )}
          </div>
          <div className="w-full p-4 mb-2 flex flex-col lg:flex-row items-start lg:items-center gap-2 justify-start lg:justify-between">
            {isLive && (
              <p className="text-xs text-gray-50 bg-basePrimary rounded-md  p-2 ">
                Happening Now
              </p>
            )}
            {(isIdPresent || isOrganizer) && (
              <div className="flex items-center px-4 gap-x-6">
                <Edit
                  session={agenda}
                  event={event}
                  refetch={refetchSession}
                  refetchEvent={refetch}
                />
                <Duplicate session={agenda} refetch={refetch} />
                <Deletes agendaId={agenda?.sessionAlias} refetch={refetch} />
                <Button className="h-fit  gap-x-2 w-fit px-0">
                  <Eye size={20} />
                  <p className="text-xs sm:text-sm text-gray-500">
                    {agenda?.sessionViews ?? "0"}
                  </p>
                </Button>
                <Button
                  disabled={rating?.review?.length === 0}
                  onClick={onReviews}
                  className="h-fit gap-x-2 w-fit px-0"
                >
                  <Rating rating={rating?.average || 0} />
                  <div className="text-gray-500 flex items-center text-xs sm:text-sm">
                    <p>{`(${rating?.rating || 0} Reviews)`}</p>
                  </div>
                </Button>
              </div>
            )}
          </div>

          <section className="w-full flex flex-col border-b pb-2">
            <div className="w-full px-3 py-3 border-y flex items-center justify-between">
              <p className="font-semibold text-base sm:text-xl">
                Session Description
              </p>
            </div>
            <div className="items-start text-[13px] sm:text-sm text-gray-600 px-3 py-4 justify-start flex w-full flex-wrap">
              {agenda?.description ?? ""}
            </div>
          </section>
          <CollapsibleWidget
            title="Speakers"
            session={agenda}
            isNotAttendee={isIdPresent || isOrganizer}
            event={event}
            refetch={refetch}
          >
            <div className="w-full px-3 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4">
              {Array.isArray(agenda?.sessionSpeakers) &&
                agenda?.sessionSpeakers?.length === 0 && (
                  <div className="w-full col-span-full h-[200px] flex items-center justify-center">
                    <p className="font-semibold">No Speaker</p>
                  </div>
                )}
              {Array.isArray(agenda?.sessionSpeakers) &&
                agenda?.sessionSpeakers.map((attendee, index) => (
                  <BoothStaffWidget
                    company={attendee?.organization ?? ""}
                    image={attendee?.profilePicture || null}
                    name={`${attendee?.firstName} ${attendee?.lastName}`}
                    profession={attendee?.jobTitle ?? ""}
                    email={attendee?.email ?? ""}
                    key={index}
                  />
                ))}
            </div>
          </CollapsibleWidget>
          <CollapsibleWidget
            title="Moderator"
            session={agenda}
            isNotAttendee={isIdPresent || isOrganizer}
            event={event}
            refetch={refetch}
          >
            <div className="w-full px-3 py-4 grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4">
              {Array.isArray(agenda?.sessionModerators) &&
                agenda?.sessionModerators?.length === 0 && (
                  <div className="w-full col-span-full h-[200px] flex items-center justify-center">
                    <p className="font-semibold">No Moderator</p>
                  </div>
                )}
              {Array.isArray(agenda?.sessionModerators) &&
                agenda?.sessionModerators.map((attendee, index) => (
                  <BoothStaffWidget
                    company={attendee?.organization ?? ""}
                    image={attendee?.profilePicture || null}
                    name={`${attendee?.firstName} ${attendee?.lastName}`}
                    profession={attendee?.jobTitle ?? ""}
                    email={attendee?.email ?? ""}
                    key={index}
                  />
                ))}
            </div>
          </CollapsibleWidget>
          <CollapsibleWidget
            title="Sponsors"
            session={agenda}
            event={event}
            isNotAttendee={isIdPresent || isOrganizer}
            refetch={refetch}
          >
            <div className="w-full px-3 py-4 grid grid-cols-2 md:grid-cols-4 items-center gap-4">
              {Array.isArray(agenda?.sessionSponsors) &&
                agenda?.sessionSponsors?.length === 0 && (
                  <div className="w-full col-span-full h-[200px] flex items-center justify-center">
                    <p className="font-semibold">No Sponsor</p>
                  </div>
                )}
              {Array.isArray(agenda?.sessionSponsors) &&
                agenda?.sessionSponsors.map((sponsor) => (
                  <Image
                    src={sponsor?.companyLogo ?? ""}
                    alt="sponsor"
                    width={200}
                    height={100}
                    className=" w-[100px] object-contain h-[40px]"
                  />
                ))}
            </div>
          </CollapsibleWidget>
          <CollapsibleWidget
            title="File"
            session={agenda}
            isNotAttendee={isIdPresent || isOrganizer}
            event={event}
            refetch={refetch}
          >
            <div className="w-full px-3 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4">
              {Array.isArray(agenda?.sessionFiles) &&
                agenda?.sessionFiles?.length === 0 && (
                  <div className="w-full col-span-full h-[200px] flex items-center justify-center">
                    <p className="font-semibold">No File</p>
                  </div>
                )}
              {Array.isArray(agenda?.sessionFiles) &&
                agenda?.sessionFiles.map((item) => (
                  <Link
                    target="_blank"
                    href={item?.file}
                    key={item?.id}
                    className="w-full group border relative rounded-lg p-3 flex items-start justify-start gap-x-2"
                  >
                    <FilePdf size={25} className="text-red-500" />
                    <div className="space-y-1 w-full">
                      <p className="text-[13px] w-full text-ellipsis whitespace-nowrap overflow-hidden sm:text-sm text-gray-500">
                        {item?.name}
                      </p>
                      <p className="text-[11px] w-full sm:text-xs text-gray-400">
                        {item?.size}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </CollapsibleWidget>
        </div>
      )}

      {isReviews && <SessionReviewsModal close={onReviews} rating={rating!} />}
    </>
  );
}
