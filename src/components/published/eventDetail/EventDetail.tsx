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
    <div className=" ">
      <EventDetailTabs
        active={active}
        setActiveTab={setActiveTab}
        event={event}
        isEventDetailPage
        aboutClassName={"border rounded-lg py-4 sm:py-6"}
      />
    </div>
  );
}
