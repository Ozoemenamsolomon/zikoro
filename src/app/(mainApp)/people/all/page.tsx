"use client";
import { useGetAttendees } from "@/services/attendee";
import React from "react";
import ReusablePeopleComponent from "../_reusable";

export default function page() {
  const useGetAttendeesprops = useGetAttendees();

  return <ReusablePeopleComponent {...useGetAttendeesprops} />;
}
