"use client";
import { useGetAttendees } from "@/hooks/services/attendee";
import React from "react";
import ReusablePeopleComponent from "../_reusable";

export default function page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  const useGetAttendeesprops = useGetAttendees({ eventId });

  return <ReusablePeopleComponent {...useGetAttendeesprops} />;
}
