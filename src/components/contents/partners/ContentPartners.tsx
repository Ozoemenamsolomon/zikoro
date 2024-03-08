"use client";

import { SideBarLayout } from "@/components";

import { PartnersList } from "./_components";
import { useFetchPartners } from "@/hooks";
import { BoxPositionProvider } from "@/context";
import { ContentTopNav } from "../_components";
export function ContentPartners({ eventId }: { eventId: string }) {
  const { data, loading, refetch } = useFetchPartners(eventId);

  return (
    <BoxPositionProvider>
      <SideBarLayout
        hasTopBar
        className="px-0 sm:px-0 pt-14 sm:pt-14"
        parentClassName="px-0 sm:px-0 py-0 sm:py-0 pt-3 sm:pt-4"
        eventId={eventId}
      >
     
        <ContentTopNav eventId={eventId}/>

        <PartnersList
          eventId={eventId}
          partners={data}
          refetch={refetch}
          loading={loading}
        />
      </SideBarLayout>
    </BoxPositionProvider>
  );
}
