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
import { cn } from "@/lib";
import { useState } from "react";

const tabs = [
  { name: "Description", id: 1 },
  { name: "Review", id: 2 },
];
export default function SingleAgenda({
  agendaId,
  eventId,
}: {
  eventId: string;
  agendaId: string;
}) {
  const [active, setActive] = useState(1);
  const { data, loading, refetch } = useFetchSingleEvent(eventId);
  const { attendees, isLoading: fetching } = useGetAllAttendees(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const { reviews } = useGetEventReviews(eventId);
  const { attendeeId, isOrganizer } = useVerifyUserAccess(eventId);
  const { agenda, isLoading, getAgenda } = useGetAgenda({ agendaId });
  return (
    <div className="w-full grid  grid-cols-1 lg:grid-cols-8 pb-32 items-start gap-3">
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
            <div className="w-full flex bg-gray-100 items-center rounded-t-xl gap-x-8 border-b border-gray-300 px-4 pt-4">
              {tabs.map((v, index) => (
                <button
                  key={index}
                  onClick={() => setActive(v?.id)}
                  className={cn(
                    "text-sm sm:text-base px-2 pb-4 font-medium",
                    active === v?.id &&
                      "font-semibold border-b  border-basePrimary"
                  )}
                >
                  {v?.name}
                </button>
              ))}
              {/* {!isSent && <Button className="w-fit h-fit px-0" onClick={() => setRating(0)}>
            <CloseOutline size={22} />
          </Button>} */}
            </div>
            {active === 1 && (
              <section className="w-full flex bg-gray-100 flex-col p-2 lg:p-4 rounded-b-xl">
                <div className="items-start text-[13px] sm:text-sm text-gray-600  justify-start flex w-full flex-wrap">
                  {agenda?.description ?? ""}
                </div>
              </section>
            )}
            {active === 2 && (
              <Engagement
                attendees={attendees}
                reviews={reviews}
                id={eventId}
                agenda={agenda}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
