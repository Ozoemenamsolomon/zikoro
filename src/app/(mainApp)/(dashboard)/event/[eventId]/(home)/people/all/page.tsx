"use client";
import { useGetAttendees } from "@/hooks/services/attendee";
import React from "react";
import ReusablePeopleComponent from "../_reusable";
import { useParams } from "next/navigation";

export default function page() {
  const { eventId } = useParams();
  const useGetAttendeesprops = useGetAttendees({ eventId });

  

  return <ReusablePeopleComponent {...useGetAttendeesprops} />;
}
