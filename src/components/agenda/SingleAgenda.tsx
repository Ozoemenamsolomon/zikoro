"use client";

import {
  useGetAgenda,
  useFetchSingleEvent,
  useCheckTeamMember,
  useVerifyUserAccess,
  useGetEventReviews,
} from "@/hooks";
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
  const { attendees, isLoading: fetching } = useGetAllAttendees(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const { reviews } = useGetEventReviews(eventId);
  const { attendeeId, isOrganizer } = useVerifyUserAccess(eventId);
  const { agenda, isLoading, getAgenda } = useGetAgenda({ agendaId });
  return (
    <div className="w-full px-4 mx-auto  max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10 grid  grid-cols-1 lg:grid-cols-8 pb-32 items-start gap-3">
      {(loading || isLoading || fetching) && (
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt className="animate-spin" size={30} />
        </div>
      )}
      {!loading && !isLoading && !fetching && (
        <>
          <AboutSession
            isIdPresent={isIdPresent}
            isOrganizer={isOrganizer}
            agenda={agenda}
            event={data}
            refetch={refetch}
            refetchSession={getAgenda}
          />
          <div className="lg:col-span-3  p-2 lg:p-4 w-full">
         
           
            { agenda &&(
              <Engagement
                attendees={attendees}
                reviews={reviews}
                id={eventId}
                agenda={agenda}
                isIdPresent={isIdPresent}
                isOrganizer={isOrganizer}
                refetch={refetch}
                refetchSession={getAgenda}
                event={data}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
