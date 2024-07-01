"use client";

import { useGetAgenda, useFetchSingleEvent, useCheckTeamMember, useVerifyUserAccess } from "@/hooks";
import { AboutSession, Engagement } from "./_components";
import { LoaderAlt } from "styled-icons/boxicons-regular";
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
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const {attendeeId, isOrganizer} = useVerifyUserAccess(eventId)
  const { agenda, isLoading, getAgenda } = useGetAgenda({ agendaId });
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-8 pb-20 items-start gap-3">
      {(loading || isLoading || fetching) && (
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt className="animate-spin" size={30} />
        </div>
      )}
      {!loading && !isLoading && !fetching && (
        <>
          <AboutSession isIdPresent={isIdPresent} isOrganizer={isOrganizer} agenda={agenda} event={data} refetch={refetch} refetchSession={getAgenda} />
          <Engagement attendees={attendees} id={eventId} agenda={agenda} />
        </>
      )}
    </div>
  );
}
