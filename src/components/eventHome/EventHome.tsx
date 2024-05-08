"use client";

import { EventCards, EventHomeLayout } from ".";
import { EmptyCard } from "../composables";
import { useGetUserHomePageEvents } from "@/hooks";

import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";

export default function EventHome() {
  const { firstOrganizationEvents, loading, refetch } = useGetUserHomePageEvents();

  return (
    <EventHomeLayout>
      {loading && (
        <div className="w-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      )}
      
      {!loading && firstOrganizationEvents.length > 0 && (
        <EventCards refetch={refetch} events={firstOrganizationEvents} />
      )}
      {!loading && firstOrganizationEvents?.length === 0 && (
        <EmptyCard text={`You have not added any event.`} />
      )}
    </EventHomeLayout>
  );
}
