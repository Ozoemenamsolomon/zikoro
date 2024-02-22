import { PartnerCard } from "./_components";
import { TPartner } from "@/types";
import { useMemo } from "react";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { EmptyCard } from "@/components/composables";

export function Sponsors({
  sponsors,
  loading,
  eventId
}: {
  sponsors: TPartner[];
  loading: boolean;
  eventId: string;
}) {

  return (
    <div className="w-full h-full grid md:grid-cols-2 xl:grid-cols-3 mt-6 items-center gap-6 px-4">
      {loading && (
        <div className="w-full col-span-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={50} className="animate-spin" />
        </div>
      )}
      {!loading && sponsors.length === 0 && (
        <EmptyCard text="No available sponsors for this event" />
      )}
      {!loading &&
        sponsors.length > 0 &&
        sponsors.map((sponsor) => (
          <PartnerCard key={sponsor.id} eventId={eventId} sponsor={sponsor} />
        ))}
    </div>
  );
}
