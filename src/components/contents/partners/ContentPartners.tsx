"use client";

import { PartnersList } from "./_components";
import { useFetchPartners } from "@/hooks";

export function ContentPartners({ eventId }: { eventId: string }) {
  const { data, loading, refetch } = useFetchPartners(eventId);

  return (

      <div className="w-full px-4">
        <PartnersList
          eventId={eventId}
          partners={data}
          refetch={refetch}
          loading={loading}
        />
      </div>
 
  );
}
