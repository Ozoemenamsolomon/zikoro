"use client";

import { PartnerCard } from "@/components/partners/sponsors/_components";
import { useFetchPartners } from "@/hooks";
import { Event } from "@/types";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { EmptyCard } from "@/components/composables";

export function Sponsors({ event }: { event: Event }) {
  const { data, loading } = useFetchPartners(event?.id);

  return (
    <div className="  w-full flex flex-col gap-y-2 items-start justify-start p-4 sm:p-6">
      {loading && (
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={50} className="animate-spin" />
        </div>
      )}
      {!loading && <EmptyCard text="No available partner for this event" />}
      {!loading &&
        Array.isArray(data) &&
        data?.map((sponsor) => (
          <PartnerCard key={sponsor.id} sponsor={sponsor} />
        ))}
    </div>
  );
}
