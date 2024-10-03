"use client";

import { EventCards, EventHomeLayout } from ".";
import { EmptyCard } from "../composables";
import { useGetUserHomePageEvents } from "@/hooks";
import {Suspense} from "react"
import { LoaderAlt } from "styled-icons/boxicons-regular";

export default function EventHome({searchParams}) {
  const { firstOrganizationEvents, loading, refetch } = useGetUserHomePageEvents();

  return (

     <EventHomeLayout searchParams={searchParams}>
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
