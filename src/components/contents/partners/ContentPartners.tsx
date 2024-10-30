"use client";

import { PartnersList } from "./_components";
import { useFetchPartners } from "@/hooks";

export function ContentPartners({ eventId }: { eventId: string }) {
  const { data, loading, refetch } = useFetchPartners(eventId);

  return (

      <div className="w-full h-full bg-[#F9FAFF]">
        <div className="w-full px-4 mx-auto  max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10">
        <PartnersList
          eventId={eventId}
          partners={data}
          refetch={refetch}
          loading={loading}
        />
        </div>
       
      </div>
 
  );
}
