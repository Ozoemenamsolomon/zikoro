"use client";

import { Events } from "@/components/published";
import { EventsFilterProvider } from "@/context";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <>
      <EventsFilterProvider>
        <Events id={id} />
      </EventsFilterProvider>
    </>
  );
}
