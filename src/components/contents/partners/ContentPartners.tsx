"use client";

import { SideBarLayout } from "@/components";
import { ContentTabs } from "../_components/ContentTabs";
import { PartnersList } from "./_components";
import { useFetchPartners } from "@/hooks";
import { BoxPositionProvider } from "@/context";
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
        <ContentTabs eventId={eventId} refetch={refetch} />

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
