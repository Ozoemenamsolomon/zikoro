"use client";

import { useFetchSingleEvent } from "@/hooks";
import { EventSchedule } from "./_components";
import { SideBarLayout } from "..";
import { EventDetailTabs } from "../composables";

export function SingleEventHome({ eventId }: { eventId: string }) {
  const { data } = useFetchSingleEvent(eventId);

  return (
    <SideBarLayout
      hasTopBar
      className="px-0 sm:px-0 pt-0 sm:pt-0"
      parentClassName="px-0 sm:px-0 py-0 sm:py-0 pt-3 sm:pt-4"
      eventId={eventId}
    >
      <div className="w-full grid grid-cols-7 items-start pt-14 ">
        <div className="w-full col-span-4 flex flex-col gap-y-4  items-start justify-start border-r">
          <EventSchedule event={data} />

          <EventDetailTabs
  
            event={data}
            aboutClassName={"lg:grid-cols-1"}
          />
        </div>
      </div>
    </SideBarLayout>
  );
}
