"use client";
import { isToday, isAfter, isBefore } from "date-fns";
import { IconifyAgendaCalendarIcon } from "@/constants";
import { ScrollableCards } from "@/components/custom_ui/scrollableCard/ScrollableCard";
import { EngagementsSettings, Event } from "@/types";
import { useGetAgendas, useGetMyAgendas } from "@/hooks";
import { useGetData } from "@/hooks/services/request";
import { Custom } from "@/components/agenda/_components";
import { useMemo } from "react";
import { formatDate, isEventLive } from "@/utils";
import { useRouter } from "next/navigation";


export function ReceptionAgenda({
  eventId,
  event,
  refetchEvent,
  isIdPresent,
  isOrganizer,
  attendeeId,
}: {
  eventId: string;
  event: Event;
  refetchEvent: () => Promise<any>;
  isIdPresent: boolean;
  isOrganizer: boolean;
  attendeeId?: number;
}) {
  const { myAgendas } = useGetMyAgendas({ eventId });
  const router = useRouter()
  const getEffectiveDate = (startDateISO: string, endDateISO: string): Date => {
    const today = new Date();
    const startDate = new Date(startDateISO);
    const endDate = new Date(endDateISO);

    if (
      isToday(startDate) ||
      (isAfter(today, startDate) && isBefore(today, endDate))
    ) {
      return today;
    }
    return startDate;
  };

  const effectiveDate = useMemo(() => {
    return getEffectiveDate(event.startDateTime, event.endDateTime);
  }, [event]);

  const {
    agendas: sessionAgendas,
    isLoading: fetching,
    getAgendas: refetchSession,
  } = useGetAgendas(eventId, effectiveDate?.toISOString(), null);
  const { data: engagementsSettings } = useGetData<EngagementsSettings>(
    `engagements/${eventId}/settings`
  );

  const agendaDate = useMemo(
    () => formatDate(effectiveDate?.toISOString()),
    [effectiveDate]
  );

  const adjustedAgendas = useMemo(() => {
    if (Array.isArray(sessionAgendas)) {
        const liveAgendas = sessionAgendas.filter(sessionAgenda => isEventLive(sessionAgenda.timeStamp.start,sessionAgenda.timeStamp.end));
        const otherAgendas = sessionAgendas.filter(sessionAgenda => !isEventLive(sessionAgenda.timeStamp.start,sessionAgenda.timeStamp.end));
        return [...liveAgendas, ...otherAgendas];
    }
    return []
  },[sessionAgendas])
  return (
    <>
      {!fetching && Array.isArray(sessionAgendas) && (
        <div className="w-full mb-6 sm:mb-10">
          <div className="w-full flex mb-4 sm:mb-6 items-center justify-between">
            <div className="flex flex-col items-start justify-start gap-y-1">
              <h2 className="font-semibold text-desktop sm:text-lg">Agenda</h2>
              <p className="flex items-center gap-x-2">
                <IconifyAgendaCalendarIcon />
                <p>{agendaDate}</p>
              </p>
            </div>
            <button
              onClick={() => router.push(`/event/${eventId}/agenda`)}
              className="text-mobile sm:text-sm gradient-text bg-basePrimary font-medium"
            >
              See All
            </button>
          </div>
          <ScrollableCards className="sm:pl-[0em] pr-[0em]">
            {adjustedAgendas?.map((sessionAgenda) => {
              return (
                <Custom
                  key={`${sessionAgenda?.timeStamp?.start}${sessionAgenda?.timeStamp?.end}`}
                  sessionAgenda={sessionAgenda}
                  refetchSession={refetchSession}
                  event={event}
                  isIdPresent={isIdPresent}
                  isOrganizer={isOrganizer}
                  isReception={true}
                  isEventDetail={true}
                  refetchEvent={refetchEvent}
                  attendeeId={attendeeId}
                  myAgendas={myAgendas}
                  className="w-[375px] bg-white sm:w-[420px] h-[230px] sm:h-[250px]"
                  engagementsSettings={engagementsSettings}
                />
              );
            })}
          </ScrollableCards>
        </div>
      )}
    </>
  );
}
