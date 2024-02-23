"use client";

import { PartnerCard } from "@/components/partners/sponsors/_components";
import { useFetchPartners } from "@/hooks";
import { Event } from "@/types";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { EmptyCard } from "@/components/composables";
import { Button } from "@/components";
import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";

export function Sponsors({
  event,
  changeMajorActiveState,
}: {
  changeMajorActiveState: (n: number) => void;
  event: Event;
}) {
  const { data, loading } = useFetchPartners(event?.id);

  return (
    <>
      <div className="flex flex-col gap-y-3 mb-1 p-4 w-full items-start justify-start sm:hidden">
        <Button
          onClick={() => changeMajorActiveState(1)}
          className="px-0 h-fit w-fit  bg-none  "
        >
          <ArrowBack className="px-1" size={22} />
          <span>Back</span>
        </Button>
        <p className="font-semibold text-base">Partners</p>
      </div>

      <div className="  w-full grid grid-cols-1 sm:grid-cols-2 gap-2 items-start justify-start pb-4 px-4 sm:pb-6 sm:px-6">
        {loading && (
          <div className="w-full col-span-full h-[300px] flex items-center justify-center">
            <LoaderAlt size={50} className="animate-spin" />
          </div>
        )}
        {!loading && Array.isArray(data) && data?.length === 0 && (
          <EmptyCard text="No available partner for this event" />
        )}
        {!loading &&
          Array.isArray(data) &&
          data?.map((sponsor) => (
            <PartnerCard key={sponsor.id} sponsor={sponsor} />
          ))}
      </div>
    </>
  );
}
