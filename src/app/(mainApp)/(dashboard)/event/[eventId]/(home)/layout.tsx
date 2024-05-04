"use client";

import { Topbar } from "@/components";
import { getCookie, saveCookie, useGetEvent } from "@/hooks";
import useEventStore from "@/store/globalEventStore";
import { Event } from "@/types";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { eventId } = useParams();
  // const currentEvent = useEventStore((state) => state.event);
  const setEvent = useEventStore((state) => state.setEvent);

  const { event, getEvent, isLoading } = useGetEvent({
    eventId,
    isAlias: true,
  });

  useEffect(() => {
    if (isLoading || !event) return;
    setEvent(event);
  }, [isLoading, eventId]);

  return (
    <div className="w-full h-full">
      <div className="w-full lg:w-[calc(100%-250px)] pt-4 bg-white min-[1024px]:float-right right-0 z-50 fixed flex justify-between items-center ">
        <Topbar eventId={eventId} />
      </div>

      <div className="w-full h-full pt-12">
        {isLoading ? <p>Loading...</p> : children}
      </div>
    </div>
  );
}
