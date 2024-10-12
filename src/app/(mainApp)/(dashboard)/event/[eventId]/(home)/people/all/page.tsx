"use client";
import { useGetAttendees } from "@/hooks/services/attendee";
import React, { Suspense } from "react";
import ReusablePeopleComponent from "../_reusable";

export default function page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  const useGetAttendeesprops = useGetAttendees({ eventId });

  return (
    <Suspense fallback={<>Loading...</>}>
      <ReusablePeopleComponent {...useGetAttendeesprops} />
    </Suspense>
  );
}
