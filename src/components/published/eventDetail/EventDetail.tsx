"use client";

import { Event } from "@/types";
import { useState } from "react";
import { SingleEvent } from "..";
import { EventDetailTabs } from "@/components/composables";

export function EventDetail({ event }: { event: Event }) {
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

      <EventDetailTabs event={event} isEventDetailPage/>
    </div>
  );
}
