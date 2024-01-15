"use client";
import { useGetAttendeesWithFavourites } from "@/services/attendee";
import { HeartFill } from "styled-icons/bootstrap";
import ReusablePeopleComponent from "../_reusable";

export default function page() {
  const { attendees, isLoading, error, getAttendees } =
    useGetAttendeesWithFavourites();

  if (attendees.length === 0 || isLoading)
    return (
      <div className="flex flex-col h-96 w-full items-center justify-center gap-2">
        <HeartFill className="h-16 w-16 text-gray-500" />
        <p className="text-sm px-2 font-medium text-gray-700 text-center w-1/2">
          This page is empty. Your favorite attendees will appear here.
        </p>
      </div>
    );

  return (
    <ReusablePeopleComponent
      attendees={attendees}
      isLoading={isLoading}
      error={error}
      getAttendees={getAttendees}
    />
  );
}
