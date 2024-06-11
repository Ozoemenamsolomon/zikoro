"use client";

import { useFetchPartnersJob, useVerifyUserAccess } from "@/hooks";
import { MarketPlaceLayout } from "../_components";
import { JobWidget } from "@/components/partners/sponsors/_components";
import { EmptyCard } from "@/components/composables";
import { Loader2 } from "styled-icons/remix-fill";
export function Jobs({ eventId }: { eventId: string }) {
  const { jobs, loading } = useFetchPartnersJob(eventId);
  const {attendee , isOrganizer} = useVerifyUserAccess(eventId)
  return (
    <MarketPlaceLayout  eventId={eventId}>
      <div className="w-full grid grid-cols-1 p-2 sm:p-4 sm:grid-cols-2 items-center gap-4">
      {loading && (
          <div className="w-full col-span-full h-[60vh] flex items-center justify-center">
            <Loader2 size={30} className="animate-spin" />
          </div>
        )}
          {!loading && jobs && jobs.length === 0 && (
            <EmptyCard height="80" width="82" text="No available Job" />
          )}

        {!loading &&
          Array.isArray(jobs) &&
          jobs?.map((job, index) => (
            <JobWidget attendee={attendee} isOrganizer={isOrganizer} key={index} job={job} className={"border rounded-lg py-4 px-3"} />
          ))}
      
      </div>
    </MarketPlaceLayout>
  );
}
