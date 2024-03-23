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
      <div className="w-full px-4">
        <PartnersList
          eventId={eventId}
          partners={data}
          refetch={refetch}
          loading={loading}
        />
      </div>
    </BoxPositionProvider>
  );
}
