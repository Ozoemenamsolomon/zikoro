"use client";

import { EventCards, EventHomeLayout } from ".";
import { EmptyCard } from "../composables";
import { useFetchOrganizationEvents } from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";

export default function OrganizationHome({
  organizationId,
}: {
  organizationId: string;
}) {
  const {
    data: eventData,
    refetch,
    loading,
  } = useFetchOrganizationEvents(organizationId);

  return (
    <EventHomeLayout>
      {loading && (
        <div className="w-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      )}

      {!loading && eventData.length > 0 && (
        <EventCards refetch={refetch} events={eventData} />
      )}
      {!loading && eventData?.length === 0 && (
        <EmptyCard text={`You have not added any event to this organization`} />
      )}
    </EventHomeLayout>
  );
}
