"use client";

import { useFetchPartnersJob, useVerifyUserAccess, useCheckTeamMember } from "@/hooks";
import { MarketPlaceLayout } from "../_components";
import { JobWidget } from "@/components/partners/sponsors/_components";
import { EmptyCard } from "@/components/composables";
import { Loader2 } from "styled-icons/remix-fill";
import { useGetData } from "@/hooks/services/request";
import { EngagementsSettings } from "@/types/engagements";
import { TLead, TLeadsInterest } from "@/types";
export function Jobs({ eventId }: { eventId: string }) {
  const { jobs, loading, refetch } = useFetchPartnersJob(eventId);
  const { attendee, isOrganizer } = useVerifyUserAccess(eventId);
  const {isIdPresent} = useCheckTeamMember({eventId})
  const { data: engagementsSettings } = useGetData<EngagementsSettings>(
    `engagements/${eventId}/settings`
  );
  // const { data: leadsInterests } = useGetData<TLeadsInterest>(
  //   `leads/interests/${eventId}`
  // );
  const { data: leads } = useGetData<TLead[]>(`leads/event/${eventId}`);
  return (
    <MarketPlaceLayout eventId={eventId}>
      <div className="w-full grid grid-cols-1 p-2 sm:p-4 sm:grid-cols-2 lg:grid-cols-3 items-center gap-4">
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
            <JobWidget
              attendee={attendee}
              key={index}
              job={job}
              isOrganizer={isOrganizer || isIdPresent}
              engagementsSettings={engagementsSettings}
              leads={leads}
              refetch={refetch}
              className={"border rounded-lg py-4 px-3"}
            />
          ))}
      </div>
    </MarketPlaceLayout>
  );
}
