"use client";
import { useGetAttendees } from "@/hooks/services/attendee";
import React from "react";
import ReusablePeopleComponent from "../_reusable";

export default function page() {
  const useGetAttendeesprops = useGetAttendees();

  console.log(useGetAttendeesprops.attendees, "attendees");

  return <ReusablePeopleComponent {...useGetAttendeesprops} />;
}
