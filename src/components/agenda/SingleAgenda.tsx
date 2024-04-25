"use client";

import { useGetAgenda, useFetchSingleEvent } from "@/hooks";
import { AboutSession, Engagement } from "./_components";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
export default function SingleAgenda({
  agendaId,
  eventId,
}: {
  eventId: string;
  agendaId: string;
}) {
  const { data, loading } = useFetchSingleEvent(eventId);
  const { agenda, isLoading, getAgenda } = useGetAgenda({ agendaId });
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-8 items-start gap-3">
      {(loading || isLoading) && (
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt className="animate-spin" size={30} />
        </div>
      )}
      {!loading && !isLoading && (
        <>
          <AboutSession agenda={agenda} event={data} refetch={getAgenda} />
          <Engagement />
        </>
      )}
    </div>
  );
}
