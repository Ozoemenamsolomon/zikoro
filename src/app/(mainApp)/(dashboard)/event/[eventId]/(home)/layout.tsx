"use client";

import { Topbar } from "@/components";
import { saveCookie, useGetEvent } from "@/hooks";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { eventId } = useParams();

  const { event, getEvent, isLoading } = useGetEvent({
    eventId,
    isAlias: true,
  });

  useEffect(() => {
    console.log("here");
    if (isLoading || !event) return;
    console.log(event.createdBy);
    saveCookie("event", event);
  }, [isLoading, eventId]);

  return (
    <div className="w-full h-full">
      <div className="w-full lg:w-[calc(100%-250px)] pt-4 bg-white min-[1024px]:float-right right-0 z-50 fixed flex justify-between items-center ">
        <Topbar eventId={eventId} />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full h-full pt-12">{children}</div>
      )}
    </div>
  );
}
