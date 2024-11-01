"use client";
import { useGetAttendees } from "@/hooks/services/attendee";
import React, { Suspense } from "react";
import ReusablePeopleComponent from "../_reusable";

export default function page({
  params: { eventId },
  searchParams: { alias },
}: {
  params: { eventId: string };
  searchParams: { alias: string };
}) {
  const useGetAttendeesprops = useGetAttendees({ eventId });

  return (
    <Suspense fallback={<>Loading...</>}>
      <ReusablePeopleComponent
        attendeeAlias={alias}
        {...useGetAttendeesprops}
      />
    </Suspense>
  );
}
