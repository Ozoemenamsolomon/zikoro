"use client"

import { Events } from ".";
import { EventsFilterProvider } from "@/context";

export default function PublishedEvent({ id }: { id: string }) {
  return (
    <EventsFilterProvider>
      <Events id={id} />
    </EventsFilterProvider>
  );
}
