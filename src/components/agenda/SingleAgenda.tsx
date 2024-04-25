"use client";

import { useGetAgenda } from "@/hooks";
import { AboutSession, Engagement } from "./_components";

export default function SingleAgenda({agendaId, eventId}:{eventId:string; agendaId: string}) {
 
  const {agenda, isLoading, getAgenda} = useGetAgenda({agendaId})
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-8 items-start gap-3">
      <AboutSession agenda={agenda} refetch={getAgenda}/>
      <Engagement />
    </div>
  );
}
