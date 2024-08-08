"use client"

import { Events } from ".";
import { EventsFilterProvider } from "@/context/EventFilterContext";

export default function PublishedEvent({ id }: { id: string }) {

  return (
    <EventsFilterProvider>
      <Events id={id} />
    </EventsFilterProvider>
  );
}
