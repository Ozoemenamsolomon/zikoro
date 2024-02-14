"use client";

import { SideBarLayout } from "@/components";
import { ContentTabs } from "../_components/ContentTabs";
import { ExhibitionHall, PartnersList } from "./_components";

export function ContentPartners({ eventId }: { eventId: string }) {

  function refetch() {
    return false
  }
  return (
    <SideBarLayout
      hasTopBar
      className="px-0 sm:px-0 pt-4 sm:pt-14"
      parentClassName="px-0 sm:px-0 py-0 sm:py-0 pt-3 sm:pt-4"
      eventId={eventId}
    >
      <ContentTabs eventId={eventId} refetch={refetch} />
      <div className="w-full grid grid-cols-1 gap-4 lg:gap-0 lg:grid-cols-8 items-start">
        <PartnersList eventId={eventId} />
        <ExhibitionHall eventId={eventId} />
      </div>
    </SideBarLayout>
  );
}
