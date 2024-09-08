"use client";

import { EventDetail } from "@/components/published";
import Link from "next/link";
import { Footer } from "@/components";
import { useFetchSingleEvent, useFetchSingleOrganization } from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { usePathname, useSearchParams } from "next/navigation";
import { SingleEvent } from "./singleEvent/SingleLiveEvent";
import { useEffect } from "react";

export default function SinglePublishedEvent({ id }: { id: string }) {
  const params = useSearchParams();
  const trackingId = params.get("trackingId");
  const affiliateCode = params.get("affiliateCode");
  const role = params.get("role");
  const { data: eventDetail } = useFetchSingleEvent(id);
  const { data, refetch } = useFetchSingleOrganization(
    eventDetail?.organization?.id
  );
  const pathname = usePathname();
  // console.log(id)
  // useValidateUser()

  useEffect(() => {
    if (eventDetail?.organization) {
      refetch();
    }
  }, [eventDetail]);
  return (
    <>
      {eventDetail ? (
        <div className="w-full h-full bg-[#F9FAFF] fixed overflow-y-auto ">
          <SingleEvent
            affiliateCode={affiliateCode}
            trackingId={trackingId}
            role={role}
            isDetail={true}
            organization={eventDetail?.organisationName}
            organizationLogo={data?.organizationLogo}
            event={eventDetail}
            useDiv={true}
            eventId={eventDetail?.eventAlias}
            imageClassName={
              "rounded-t-none sm:rounded-l-none rounded-tr-none sm:rounded-tl-none sm:rounded-l-none"
            }
            className="w-full bg-none  shadow-none"
          />
         
         

          <div className=" ">
            <EventDetail event={eventDetail} />

            {!pathname.includes("preview") && (
              <Link
                href={`/live-events/organization/${eventDetail?.organisationId}`}
                className="flex mt-10 sm:mt-20 hover:underline items-center gap-x-2 text-basePrimary text-sm"
              >
                <span>See All Events</span>
              </Link>
            )}
          </div>

          {!pathname.includes("preview") && <Footer />}
        </div>
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      )}
    </>
  );
}
