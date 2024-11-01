"use client";

import { TOrgEvent } from "@/types";
import { EventCard } from "..";

export function EventCards({
  events,
  refetch,
}: {
  refetch: () => Promise<any>;
  events: TOrgEvent[] | null;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center w-full h-full xl:grid-cols-3">
      {Array.isArray(events) &&
        events?.map((event, index) => (
          <EventCard
            key={`${event.createdAt}${index}`}
            event={event}
            refetch={refetch}
          />
        ))}
    </div>
  );
}
