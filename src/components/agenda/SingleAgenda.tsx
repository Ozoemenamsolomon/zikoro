"use client";

import { useGetAgenda, useFetchSingleEvent } from "@/hooks";
import { AboutSession, Engagement } from "./_components";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { useGetAllAttendees } from "../../hooks/services/attendee";
export default function SingleAgenda({
  agendaId,
  eventId,
}: {
  eventId: string;
  agendaId: string;
}) {
  const { data, loading, refetch } = useFetchSingleEvent(eventId);
  const { attendees, isLoading: fetching } = useGetAllAttendees();
  const { agenda, isLoading, getAgenda } = useGetAgenda({ agendaId });
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-8 items-start gap-3">
      {(loading || isLoading || fetching) && (
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt className="animate-spin" size={30} />
        </div>
      )}
      {!loading && !isLoading && !fetching && (
        <>
          <AboutSession agenda={agenda} event={data} refetch={refetch} refetchSession={getAgenda} />
          <Engagement attendees={attendees} id={eventId} agenda={agenda} />
        </>
      )}
    </div>
  );
}
