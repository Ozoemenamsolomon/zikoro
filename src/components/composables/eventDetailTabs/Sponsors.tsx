"use client";

import { PartnerCard } from "@/components/partners/sponsors/_components";
import { useFetchPartners, useFormatEventData } from "@/hooks";
import { Event } from "@/types";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { EmptyCard } from "@/components/composables";
import { Button } from "@/components";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { cn } from "@/lib";

export function Sponsors({
  event,
  changeMajorActiveState,
}: {
  changeMajorActiveState: (n: number) => void;
  event: Event;
}) {
  const router = useRouter();
  const { data, loading } = useFetchPartners(event?.eventAlias);
  const { startDate, endDate } = useFormatEventData(event);

  const dataString = useMemo(() => {
    return encodeURIComponent(
      JSON.stringify({
        image: event?.eventPoster,
        eventTitle: event?.eventTitle,
        organizerLogo: event?.organisationLogo,
        startDate,
        endDate,
      })
    );
  }, [event]);

  const approvedPartners = useMemo(() => {
    return (
      data?.filter(({ partnerStatus }) => partnerStatus === "active") || []
    );
  }, [data]);
 
  const restructureData = useMemo(() => {
    if (data) {
      const newData = {
        sponsor: approvedPartners?.filter(
          (v) => v?.partnerType === "sponsor"
        ),
        exhibitor: approvedPartners?.filter(
          (v) => v?.partnerType === "exhibitor"
        ),
      };

      return newData;
    }
  }, [approvedPartners]);
  return (
    <div className="w-full bg-white p-3">
       <div className="w-full rounded-lg border p-2">
                    <h3 className="pb-2 invisible w-full text-center">
                      Event Partners
                    </h3>
    
      <div className="w-full bg-white py-3">
      {Array.isArray(event?.partnerDetails) &&
        event?.partnerDetails?.length > 0 && (
          <div className="w-full my-8 flex items-center justify-center">
          <Button
            onClick={() =>
              router.push(
                `/live-events/${event?.eventAlias}/partners?e=${dataString}`
              )
            }
            className="bg-basePrimary  rounded-lg text-white font-medium"
          >
            Become a Partner
          </Button>
        </div>
        )}
     
        {/* <div className="flex flex-col gap-y-3 mb-1 p-4 w-full items-start justify-start sm:hidden">
          <Button
            onClick={() => changeMajorActiveState(1)}
            className="px-0 h-fit w-fit  bg-none  "
          >
            <ArrowBack className="px-1" size={22} />
            <span>Back</span>
          </Button>
          <p className="font-semibold text-base">Partners</p>
        </div> */}

        <div className="  w-full pb-4  sm:pb-6 ">
          {loading && (
            <div className="w-full col-span-full h-[300px] flex items-center justify-center">
              <LoaderAlt size={30} className="animate-spin" />
            </div>
          )}
          {!loading && Array.isArray(data) && data?.length === 0 && (
            <EmptyCard text="No available partner for this event" />
          )}
        
             {!loading && restructureData &&
                Object.entries(restructureData).map(([partnerType, data]) => (
                  <div key={Math.random()} className={cn("w-full bg-gradient-to-tr rounded-lg p-3 mb-4 from-custom-bg-gradient-start to-custom-bg-gradient-end hidden", data?.length > 0 && 'block')}>
                   {data?.length > 0 && <p className="font-semibold capitalize text-zinc-700 ">
                      {partnerType} 
                    </p>}
                    <div
                      key={Math.random()}
                      className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 items-start justify-start"
                    >
                      {Array.isArray(data) &&
                        data?.map((sponsor) => (
                          <PartnerCard key={sponsor.id} event={event} isEventDetail sponsor={sponsor} />
                        ))}
                    </div>
                  </div>
                ))}
        </div>
      </div>
      </div>
    </div>
  );
}
