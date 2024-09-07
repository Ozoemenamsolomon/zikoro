"use client";

import { Event } from "@/types";
import { HeroLayout, } from "..";
import { SingleEvent } from "../singleEvent/SingleEvent";
import { useState, useEffect } from "react";
import { useEventFilterHook } from "@/context/EventFilterContext";
import { EmptyCard } from "@/components/composables";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useGetPublishedEvents } from "@/hooks";
import {getCookie} from "@/hooks"
export function Events({ id }: { id: string }) {
  const { locations, startDate, titles, endDate, pagination } =
    useEventFilterHook();
  const {
    data: publishedEvents,
    loading,
    loadingNextPage,
    isLastPage,
  } = useGetPublishedEvents(id, pagination.startIndex, pagination.endIndex);
  const [filteredEvents, setFilteredEvents] = useState<Event[] | null>(null);
  const query = getCookie("currentOrganization");

  useEffect(() => {
    if (publishedEvents) {
      // Apply filters
      const filtered: Event[] | null = publishedEvents.filter((event) => {
        // Date range filter
        const isDateInRange =
          (!startDate || new Date(event.startDateTime) >= startDate) &&
          (!endDate || new Date(event.startDateTime) <= endDate);

        // Title filter
        const isTitleMatch =
          titles.length === 0 || titles.includes(event.eventTitle);

        // Location filter
        const isLocationMatch =
          locations.length === 0 || locations.includes(event.eventCity);

        return (
          isDateInRange &&
          isTitleMatch &&
          isLocationMatch
          
        );
      });

      setFilteredEvents(filtered);
    }
  }, [publishedEvents, startDate, endDate, titles, locations]);

  return (
    <HeroLayout
      loading={loading}
      loadingNextPage={loadingNextPage}
      publishedEvents={publishedEvents}
      isLastPage={isLastPage}
    >
      {loading && (
        <div className="w-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={50} className="animate-spin" />
        </div>
      )}
      {Array.isArray(filteredEvents) &&
        filteredEvents?.length > 0 &&
        filteredEvents?.map((event) => (
          <SingleEvent
            key={event.id}
            event={event}
            eventId={event.eventAlias}
            organization={query?.name}
            className="mb-6 sm:mb-10"
          />
        ))}
      {!loading && filteredEvents?.length === 0 && (
        <EmptyCard text={`No event for ${query?.name} organization`} />
      )}
    </HeroLayout>
  );
}
