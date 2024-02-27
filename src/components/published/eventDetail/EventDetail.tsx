"use client";

import { Event } from "@/types";
import { useState } from "react";
import { SingleEvent } from "..";
import { EventDetailTabs } from "@/components/composables";

export function EventDetail({ event }: { event: Event }) {
  const [active, setActive] = useState(1);

  function setActiveTab(active: number) {
    setActive(active);
  }

  return (
    <div className="bg-white rounded-2xl shadow ">
      <SingleEvent
        isDetail={true}
        organization={event.organisationName}
        event={event}
        useDiv={true}
        eventId={event.id}
        className="w-full bg-none  shadow-none"
      />

      <EventDetailTabs
        active={active}
        setActiveTab={setActiveTab}
        event={event}
        isEventDetailPage
      />
    </div>
  );
}
