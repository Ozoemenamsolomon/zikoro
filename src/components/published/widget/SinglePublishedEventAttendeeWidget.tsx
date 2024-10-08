"use client";

import { cn } from "@/lib";
import { TAttendee } from "@/types";
import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link"

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
        "relative h-[50px] w-[50px] rounded-full group border-4 border-[#F7F8FF] flex items-center bg-gray-200 uppercase font-medium text-lg justify-center",
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
      <div className="w-fit min-w-[230px] hidden absolute -bottom-14 items-start flex-col  left-1 group-hover:flex border-gradient p-1 ">
      <p className="gradient-text flex  bg-basePrimary text-sm capitalize gap-x-1"><span>{attendee?.firstName}</span> <span>{attendee?.lastName?.charAt(0)}.</span></p>
      <Link className="text-sm capitalize gradient-text bg-basePrimary" href="">Register to see all participants</Link>
      </div>
    </div>
  );
}

export function SinglePublishedEventAttendeeWidget({
  attendees,
}: {
  attendees: TAttendee[];
}) {
  const [otherAttendeeCount, setOtherAttendeeCount] = useState(0);


  const slicedArray = useMemo(() => {
    if (Array.isArray(attendees)) {
      setOtherAttendeeCount(attendees?.length - 4);
      return attendees?.length < 4 ? attendees : attendees.slice(0, 4);
    } else {
      return [];
    }
  }, [attendees]);
  return (
    <div className="flex w-[250px] flex-col items-start justify-start gap-y-2">
      <div className="flex w-full items-center">
        {slicedArray?.map((attendee, index) => (
          <ImageWidget
            key={index}
            attendee={attendee}
            className={index === 0 ? "-left-[3%]": index === 1 ? "-left-[15%]" : index === 2 ? "-left-[27%]" : index === 3 ? "-left-[40%]" :""}
          />
        ))}
        {otherAttendeeCount > 0 && <div
      className="relative -left-[52%] h-[50px] w-[50px] rounded-full border-4 border-[#F7F8FF] flex items-center bg-gray-400 uppercase font-medium text-lg justify-center"
      
    >
      
        <p className="gradient-text  bg-basePrimary">{otherAttendeeCount}<span className="text-[22px]">+</span></p>
      
    </div>}
      </div>
     
    </div>
  );
}
