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
  useGetMyAgendas,
  // useGetEventAttendees,
} from "@/hooks";
import { generateDateRange } from "@/utils";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useRouter } from "next/navigation";
import { useGetData } from "@/hooks/services/request";
import { EngagementsSettings } from "@/types/engagements";
import { IconifyAgendaCalendarIcon } from "@/constants";
export default function Agenda({
  eventId,
  isReception,
  searchParams: { a: queryParam, date: activeDateQuery },
}: {
  eventId: string;
  isReception?: boolean;
  searchParams: any
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentEvent = getCookie("currentEvent");

  const { attendeeId, isOrganizer } = useVerifyUserAccess(eventId);
  // const { attendees } = useGetAllAttendees(); //
  const [isOpen, setOpen] = useState(false);
  const { data, refetch } = useFetchSingleEvent(eventId);
  // const { attendees: eventAttendees } = useGetEventAttendees(eventId); //
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const [isFullScreen, setFullScreen] = useState(false);
  const {
    agendas: sessionAgendas,
    isLoading: fetching,
    getAgendas: refetchSession,
  } = useGetAgendas(
    eventId,
    activeDateQuery || currentEvent?.startDate,
    queryParam
  );
  const { myAgendas } = useGetMyAgendas({ eventId });
  const { data: engagementsSettings } = useGetData<EngagementsSettings>(
    `engagements/${eventId}/settings`
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
                className={`pl-2 ${
                  (!queryParam || queryParam === null) && "text-basePrimary"
                }`}
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
          <div className="min-w-max flex items-center rounded-xl h-fit justify-center bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end gap-x-0">
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
                    "p-1 text-gray-400 flex w-fit h-fit gap-2 flex-col items-center justify-center  text-mobile sm:text-sm",
                    (activeDateQuery || currentEvent?.startDate) ===
                      val?.date &&
                      "border-basePrimary border bg-white shadow rounded-xl"
                  )}
                >
                  <p className="font-medium">Day {index + 1}</p>
                  <p className="flex items-center gap-x-2">
                    {" "}
                    <IconifyAgendaCalendarIcon /> {val?.formattedDate}
                  </p>
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

        <div
          className={cn(
            "w-full p-2 sm:p-4 grid grid-cols-1 items-center gap-8 pb-20",
            isReception && "p-0 sm:p-0 py-2 sm:py-4"
          )}
        >
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
                  myAgendas={myAgendas}
                  engagementsSettings={engagementsSettings}
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
