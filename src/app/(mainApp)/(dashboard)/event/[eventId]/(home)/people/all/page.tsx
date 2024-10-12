"use client";
import { useGetAttendees } from "@/hooks/services/attendee";
import React, { Suspense } from "react";
import ReusablePeopleComponent from "../_reusable";

export default function page({
  params: { eventId },
  searchParams: { attendeeAlias },
}: {
  params: { eventId: string };
  searchParams: { attendeeAlias: string };
}) {
  const useGetAttendeesprops = useGetAttendees({ eventId });

  return (
<<<<<<< Updated upstream
    <Suspense fallback={<>Loading...</>}>
      <ReusablePeopleComponent {...useGetAttendeesprops} />
    </Suspense>
=======
    <ReusablePeopleComponent
      attendeeAlias={attendeeAlias}
      {...useGetAttendeesprops}
    />
>>>>>>> Stashed changes
  );
}
