"use client";

import { cn } from "@/lib";
import { TAttendee } from "@/types";
import Image from "next/image";
import { useMemo } from "react";

function ImageWidget({
  attendee,
  className,
}: {
  className?: string;
  attendee: TAttendee;
}) {
  return (
    <div
      className={cn(
        "relative h-16 w-16 rounded-full border-4 border-[#F7F8FF] flex items-center bg-gray-200 uppercase font-medium text-xl justify-center",
        className
      )}
    >
      {attendee?.profilePicture &&
      attendee?.profilePicture?.startsWith("https") ? (
        <Image
          className="w-16 h-16 rounded-full object-cover"
          src={attendee?.profilePicture}
          alt={attendee?.firstName}
          width={100}
          height={100}
        />
      ) : (
        <p className="gradient-text  bg-basePrimary">{attendee?.firstName[0]}{attendee?.lastName[0]}</p>
      )}
    </div>
  );
}

export function SinglePublishedEventAttendeeWidget({
  attendees,
}: {
  attendees: TAttendee[];
}) {
  const attendeeNames = useMemo(() => {
    if (!attendees) return null;
    const names = attendees?.map(
      ({ lastName, firstName }) =>
        `${firstName[0]?.toUpperCase() ?? ""}${firstName?.substring(1) ?? ""} ${
          lastName[0]?.toUpperCase() ?? ""
        }${lastName?.substring(1) ?? ""}`
    );

    const isGreaterThanZero = names.slice(3, names?.length)?.length > 0;
    if (!isGreaterThanZero) {
      return `${names.slice(0, 3)}`;
    } else if (names.slice(3, names?.length)?.length === 1) {
      return `${names.slice(0, 3)} and ${
        names.slice(3, names?.length)?.length
      } Other`;
    } else {
      return `${names.slice(0, 3)} and ${
        names.slice(3, names?.length)?.length
      } Others`;
    }
  }, [attendees]);

  const slicedArray = useMemo(() => {
    if (Array.isArray(attendees)) {
      return attendees?.length < 4 ? attendees : attendees.slice(0, 4);
    } else {
      return [];
    }
  }, [attendees]);
  return (
    <div className="flex flex-col items-start justify-start gap-y-2">
      <div className="flex items-center">
        {slicedArray?.map((attendee, index) => (
          <ImageWidget
            key={index}
            attendee={attendee}
            className={index === 1 ? "-left-[15%]" : index === 2 ? "-left-[30%]" : index === 3 ? "-left-[45%]" :""}
          />
        ))}
      </div>
      {attendeeNames && <p>{attendeeNames}</p>}
    </div>
  );
}
