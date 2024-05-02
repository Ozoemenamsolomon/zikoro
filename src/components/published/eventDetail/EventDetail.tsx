"use client";

import { Event } from "@/types";
import { useState } from "react";
import { EventDetailTabs } from "@/components/composables";

export function EventDetail({ event }: { event: Event }) {
  const [active, setActive] = useState(1);

  function setActiveTab(active: number) {
    setActive(active);
  }

  return (
    <div className="bg-white rounded-2xl shadow ">
    
      <EventDetailTabs
        active={active}
        setActiveTab={setActiveTab}
        event={event}
        isEventDetailPage
      />
    </div>
  );
}
