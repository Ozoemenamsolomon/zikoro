"use client";

import { cn } from "@/lib";
import { TAttendee } from "@/types";
import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";

function ImageWidget({
  attendee,
  className,
  isReception,
  isEventDetail
}: {
  className?: string;
  attendee: TAttendee;
  isReception?: boolean;
  isEventDetail?:boolean;
}) {
  const [clickMobile, setClickMobile] = useState(false);
  return (
    <div
      onClick={() => {
        setClickMobile(true);
        setTimeout(() => {
          setClickMobile(false);
        }, 1000);
      }}
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
        <p className="gradient-text  bg-basePrimary">
          {attendee?.firstName[0]}
          {attendee?.lastName[0]}
        </p>
      )}
   {!isReception &&   <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-fit min-w-[230px] hidden absolute -bottom-14 items-start flex-col  left-1 group-hover:flex border-gradient p-1 ",
          clickMobile && "block"
        )}
      >
        <p className="gradient-text flex  bg-basePrimary text-sm capitalize gap-x-1">
          <span>{attendee?.firstName}</span>{" "}
          <span>{attendee?.lastName?.charAt(0)}.</span>
        </p>
      
          <Link
            className="text-sm capitalize gradient-text bg-basePrimary"
            href=""
          >
            Register to see all participants
          </Link>
      
      </div>}
    </div>
  );
}

export function EventAttendeeWidget({
  attendees,
  isReception,
  isEventDetail
}: {
  attendees: TAttendee[];
  isReception?: boolean;
  isEventDetail?:boolean;
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

  const formattedCount = useMemo(() => {
    if (otherAttendeeCount >= 1000) {
      return (
        (otherAttendeeCount / 1000).toFixed(
          otherAttendeeCount % 1000 === 0 ? 0 : 1
        ) + "K"
      );
    } else {
      return otherAttendeeCount.toString();
    }
  }, [otherAttendeeCount]);

  const names = useMemo(() => {
    const attendeeNames = slicedArray?.map(
      ({ firstName, lastName }) => ` ${firstName} ${lastName?.charAt(0)}`
    );
    const isGreaterThanZero =
      attendeeNames.slice(3, attendeeNames?.length)?.length > 0;
    if (!isGreaterThanZero) {
      return `${attendeeNames.slice(0, 3)}`;
    } else if (attendeeNames.slice(3, attendeeNames?.length)?.length === 1) {
      return `${attendeeNames.slice(0, 3)} and Other`;
    } else {
      return `${attendeeNames.slice(0, 3)} and Others`;
    }
  }, [slicedArray]);

  return (
    <div className="flex items-center gap-x-1">
      <div className="w-fit  ">
        <div className="flex w-full items-center">
          {slicedArray?.map((attendee, index) => (
            <ImageWidget
              key={index}
              isReception={isReception}
              isEventDetail={isEventDetail}
              attendee={attendee}
              className={
                index === 0
                  ? "-left-[3%]"
                  : index === 1
                  ? "-left-[13%]"
                  : index === 2
                  ? "-left-[24%]"
                  : index === 3
                  ? "-left-[35%]"
                  : ""
              }
            />
          ))}
          {otherAttendeeCount > 0 && (
            <div className="relative -left-[45%] h-[50px] w-[50px] rounded-full border-4 border-[#F7F8FF] flex items-center bg-gray-400 uppercase font-medium text-lg justify-center">
              <p className="gradient-text  bg-basePrimary">
                <span className="text-[22px]">+</span>
                {formattedCount}
              </p>
            </div>
          )}
        </div>
      </div>
     {isEventDetail ?  <></>: <p className={cn("capitalize relative ",  slicedArray?.length === 1
                  ? "-left-[3%]"
                  : slicedArray?.length === 2
                  ? "ml-[-3%]"
                  : slicedArray?.length === 3
                  ? "ml-[-6%]": slicedArray?.length === 4
                  ? "ml-[-10%]":"")}>{names}</p>}
    </div>
  );
}
