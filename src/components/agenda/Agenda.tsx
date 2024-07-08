"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PlusCircle } from "styled-icons/bootstrap";
import { Button } from "..";
import { cn } from "@/lib";
import { useState, useMemo } from "react";
import { Printer } from "styled-icons/evaicons-solid";
import { ScanDash } from "styled-icons/fluentui-system-regular";
import { Custom, AddSession, FullScreenView } from "./_components";
import {
  getCookie,
  useFetchSingleEvent,
  useGetAgendas,
  useVerifyUserAccess,
  useCheckTeamMember,
  // useGetEventAttendees,
} from "@/hooks";
import { generateDateRange } from "@/utils";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useRouter } from "next/navigation";
export default function Agenda({
  eventId,
  isReception,
}: {
  eventId: string;
  isReception?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentEvent = getCookie("currentEvent");
  const search = useSearchParams();
  const queryParam = search.get("a");
  const { attendeeId, isOrganizer } = useVerifyUserAccess(eventId);
  // const { attendees } = useGetAllAttendees(); //
  const [isOpen, setOpen] = useState(false);
  const { data, refetch } = useFetchSingleEvent(eventId);
  // const { attendees: eventAttendees } = useGetEventAttendees(eventId); //
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const [isFullScreen, setFullScreen] = useState(false);
  const activeDateQuery = search.get("date");
  const {
    agendas: sessionAgendas,
    isLoading: fetching,
    getAgendas: refetchSession,
  } = useGetAgendas(
    eventId,
    activeDateQuery || currentEvent?.startDate,
    queryParam
  );

  const dateRange = useMemo(() => {
    if (data) {
      const genDate = generateDateRange(data?.startDateTime, data?.endDateTime);
      // setActiveDate(genDate[0]?.date);
      return genDate;
    } else {
      return [];
    }
  }, [data]);

  function onClose() {
    setOpen((prev) => !prev);
  }

  function toggleFullScreenMode() {
    setFullScreen((prev) => !prev);
  }

  /**
   const attendeeId = useMemo(() => {
    return attendees?.find(
      ({ email, eventAlias }) =>
        eventAlias === eventId && email === user?.userEmail
    )?.id;
  }, [attendees]);

  const isOrganizer = useMemo(() => {
    if (attendeeId && eventAttendees) {
      return eventAttendees?.some(
        ({ attendeeType, id }) =>
          id === attendeeId && attendeeType.includes("organizer")
      );
    } else {
      return false;
    }
  }, [eventAttendees, attendees, attendeeId]);
 */

  // 

  return (
    <>
      <div>
        {!isReception && (
          <div className="w-full pl-[60px] lg:pl-[18px] overflow-x-auto no-scrollbar  px-4 py-2 text-base flex items-center gap-x-8 justify-between text-[#3E404B]">
            <div className="flex items-center font-normal justify-center gap-x-8 text-sm">
              <Link
                href={`/event/${eventId}/agenda?date=${
                  activeDateQuery || currentEvent?.startDate
                }`}
                className={`pl-2 ${(!queryParam || queryParam === null) && "text-basePrimary"}`}
              >
                Agenda
              </Link>
              <Link
                href={`/event/${eventId}/agenda?date=${
                  activeDateQuery || currentEvent?.startDate
                }&a=my-agenda`}
                className={`pl-2 ${
                  queryParam?.includes("agenda") && "text-basePrimary"
                }`}
              >
                My Agenda
              </Link>
            </div>

            <Button
              onClick={onClose}
              className={cn(
                " text-gray-50 bg-basePrimary hidden gap-x-2 h-11 sm:h-12 font-medium",
                (isIdPresent || isOrganizer) &&
                  (activeDateQuery || currentEvent?.startDate) &&
                  "flex"
              )}
            >
              <PlusCircle size={22} />
              <p>Session</p>
            </Button>
          </div>
        )}
        <div className="w-full no-scrollbar mt-8 overflow-x-auto">
          <div className="min-w-max flex items-center border-b px-4  gap-x-8">
            {Array.isArray(dateRange) &&
              dateRange?.map((val, index) => (
                <button
                  key={val?.date}
                  onClick={() => {
                    router.push(
                      `${pathname}?date=${val?.date}&a=${queryParam}`
                    );
                    // refetchSession();
                  }}
                  className={cn(
                    "pb-3 text-gray-400  text-base sm:text-lg",
                    (activeDateQuery || currentEvent?.startDate) ===
                      val?.date &&
                      "border-basePrimary border-b-2 text-basePrimary"
                  )}
                >
                  {val?.formattedDate}
                </button>
              ))}
          </div>
        </div>
        {(isIdPresent || isOrganizer) &&
          Array.isArray(sessionAgendas) &&
          sessionAgendas?.length > 0 && (
            <div
              className={cn(
                "w-full flex items-end p-4 justify-end gap-x-2 ",
                isReception && "hidden"
              )}
            >
              <Button className="px-0 w-fit h-fit ">
                <Printer size={20} />
              </Button>
              <Button
                onClick={toggleFullScreenMode}
                className="px-0 w-fit h-fit "
              >
                <ScanDash size={20} />
              </Button>
            </div>
          )}

        <div className="w-full p-2 sm:p-4 grid grid-cols-1 items-center gap-8 pb-20">
          {fetching && (
            <div className="w-full col-span-full h-[20rem] flex items-center justify-center">
              <LoaderAlt size={30} className="animate-spin" />
            </div>
          )}
          {!fetching &&
            Array.isArray(sessionAgendas) &&
            sessionAgendas?.length === 0 && (
              <div className="w-full col-span-full h-[18rem] flex items-center justify-center">
                <p className="font-semibold">No Agenda</p>
              </div>
            )}
          {!fetching &&
            Array.isArray(sessionAgendas) &&
            sessionAgendas?.map((sessionAgenda) => {
              return (
                <Custom
                  key={`${sessionAgenda?.timeStamp?.start}${sessionAgenda?.timeStamp?.end}`}
                  sessionAgenda={sessionAgenda}
                  refetchSession={refetchSession}
                  event={data}
                  isIdPresent={isIdPresent}
                  isOrganizer={isOrganizer}
                  isReception={isReception}
                  refetchEvent={refetch}
                  attendeeId={attendeeId}
                />
              );
            })}
        </div>
      </div>
      {isOpen && (
        <AddSession
          refetch={refetch}
          eventStartDate={activeDateQuery || currentEvent?.startDate}
          close={onClose}
          refetchSession={refetchSession}
          eventId={eventId}
          event={data}
        />
      )}
      {isFullScreen && (
        <FullScreenView
          close={toggleFullScreenMode}
          sessionAgendas={sessionAgendas}
          isIdPresent={isIdPresent}
          isOrganizer={isOrganizer}
        />
      )}
    </>
  );
}
