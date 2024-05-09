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

  return <>{isLoading ? <p>Loading...</p> : children}</>;
}
