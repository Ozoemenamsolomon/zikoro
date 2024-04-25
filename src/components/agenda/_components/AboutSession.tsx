"use client";

import { Button } from "@/components";
import { Eye } from "@styled-icons/feather/Eye";
import { Star } from "@styled-icons/bootstrap/Star";
import { EventLocationType } from "@/components/composables";
import { Link } from "@styled-icons/octicons/Link";
import { LocationPin } from "@styled-icons/entypo/LocationPin";
import { CollapsibleWidget, Duplicate, Edit, Deletes } from ".";
import { FilePdf } from "@styled-icons/fa-regular/FilePdf";
import Image from "next/image";
import { TAgenda, Event } from "@/types";
import { useMemo, useEffect } from "react";
import { getCookie, useUpdateAgenda } from "@/hooks";
import { isEventLive, formatTime, formatLongDate } from "@/utils";
import { BoothStaffWidget } from "@/components/partners/sponsors/_components";
export function AboutSession({
  agenda,
  event,
  refetch,
}: {
  event: Event | null;
  refetch?: () => Promise<any>;
  agenda: TAgenda | null;
}) {
  const user = getCookie("user");
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
  }, []);

  useEffect(() => {
    (async () => {
      if (agenda) {
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
          <div className="w-full h-48 sm:h-[16rem] bg-gray-200 animate-pulse"></div>
          <div className="w-full p-4 mb-2 flex flex-col lg:flex-row items-start lg:items-center gap-2 justify-start lg:justify-between">
            {isLive && (
              <p className="text-xs text-gray-50 bg-basePrimary rounded-md  p-2 ">
                Happening Now
              </p>
            )}
            <div className="flex items-center px-4 gap-x-2">
              <Edit session={agenda} event={event} refetch={refetch} />
              <Duplicate session={agenda} refetch={refetch} />
              <Deletes agendaId={agenda?.id} refetch={refetch} />
              <Button className="h-fit  gap-x-2 w-fit px-0">
                <Eye size={20} />
                <p className="text-xs sm:text-sm text-gray-500">{agenda?.sessionViews ?? "0"}</p>
              </Button>
              <Button className="h-fit gap-x-2 w-fit px-0">
                <Star size={20} />
                <div className="text-gray-500 flex items-center text-xs sm:text-sm gap-x-1">
                  <p>4.5 .</p>
                  <p>Reviews</p>
                </div>
              </Button>
            </div>
          </div>
          <h2 className="text-base px-4 w-full mb-2 text-ellipsis whitespace-nowrap overflow-hidden sm:text-xl font-medium">
            {agenda?.sessionTitle ?? ""}
          </h2>
          <p className="mb-2 px-4 text-gray-500 text-[13px]">
            {` ${agendaDate ?? ""} ${agendaTime ?? ""}`}
          </p>
          <div className="flex px-4 items-center flex-wrap gap-3 mb-2 ">
            <EventLocationType locationType={agenda?.sessionType ?? ""} />
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
              <button className="flex items-center gap-x-2">
                <Link size={18} />
                <p className="text-xs">Join Live Event</p>
              </button>
            )}
          </div>

          <section className="w-full flex flex-col  pb-2">
            <div className="w-full px-3 py-3 border-y flex items-center justify-between">
              <p className="font-semibold text-base sm:text-xl">
                Session Description
              </p>
            </div>
            <div className="items-start text-[13px] sm:text-sm text-gray-600 px-3 py-4 justify-start flex w-full flex-wrap">
              when an unknown printer took a galley of type and scrambled it to
              make a type specimen book. It has survived not only five
              centuries, but also the leap into electronic typesetting,
              remaining essentially unchanged. It was popularised in the 1960s
              with the release of Letraset sheets containing Lorem Ipsum
              passages, and more recently with desktop publishing software like
              Aldus PageMaker including versions of Lorem Ipsum.
            </div>
          </section>
          <CollapsibleWidget
            title="Speakers"
            session={agenda}
            event={event}
            refetch={refetch}
          >
            <div className="w-full px-3 py-4 grid grid-cols-3 items-center gap-4">
              {Array.isArray(agenda?.sessionSpeakers) &&
                agenda?.sessionSpeakers?.length === 0 && (
                  <div className="w-full col-span-full h-[200px] flex items-center justify-center">
                    <p className="font-semibold">No Speaker</p>
                  </div>
                )}
              {Array.isArray(agenda?.sessionSpeakers) &&
                agenda?.sessionSpeakers.map((attendee, index) => (
                  <BoothStaffWidget
                    company={"DND"}
                    image={null}
                    name={`${attendee?.firstName} ${attendee?.lastName}`}
                    profession={"Manager"}
                    email={attendee?.email ?? ""}
                    ticketType={attendee?.ticketType ?? "Attendee"}
                    key={index}
                  />
                ))}
            </div>
          </CollapsibleWidget>
          <CollapsibleWidget
            title="Moderator"
            session={agenda}
            event={event}
            refetch={refetch}
          >
            <div className="w-full px-3 py-4 grid grid-cols-3 items-center gap-4">
              {Array.isArray(agenda?.sessionModerators) &&
                agenda?.sessionModerators?.length === 0 && (
                  <div className="w-full col-span-full h-[200px] flex items-center justify-center">
                    <p className="font-semibold">No Moderator</p>
                  </div>
                )}
              {Array.isArray(agenda?.sessionModerators) &&
                agenda?.sessionModerators.map((attendee, index) => (
                  <BoothStaffWidget
                    company={"DND"}
                    image={null}
                    name={`${attendee?.firstName} ${attendee?.lastName}`}
                    profession={"Manager"}
                    email={attendee?.email ?? ""}
                    ticketType={attendee?.ticketType ?? "Attendee"}
                    key={index}
                  />
                ))}
            </div>
          </CollapsibleWidget>
          <CollapsibleWidget
            title="Sponsors"
            session={agenda}
            event={event}
            refetch={refetch}
          >
            <div className="w-full px-3 py-4 grid grid-cols-4 items-center gap-4">
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
            event={event}
            refetch={refetch}
          >
            <div className="w-full px-3 py-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 items-center gap-4">
              {Array.isArray(agenda?.sessionFiles) &&
                agenda?.sessionFiles?.length === 0 && (
                  <div className="w-full col-span-full h-[200px] flex items-center justify-center">
                    <p className="font-semibold">No File</p>
                  </div>
                )}
              {Array.isArray(agenda?.sessionFiles) &&
                agenda?.sessionFiles.map((item) => (
                  <div
                    key={item?.id}
                    className="w-full group border relative rounded-lg p-3 flex items-start justify-start gap-x-2"
                  >
                    <FilePdf size={25} className="text-red-500" />
                    <div className="space-y-1">
                      <p className="text-[13px] sm:text-sm text-gray-500">
                        {item?.name}
                      </p>
                      <p className="text-[11px] sm:text-xs text-gray-400">
                        {item?.size}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CollapsibleWidget>
        </div>
      )}
    </>
  );
}
