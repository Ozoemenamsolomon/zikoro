"use client";

import { Button } from "@/components";
import Image from "next/image";
import { ArrowBack } from "styled-icons/boxicons-regular";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/constants";
import { useMemo, useState } from "react";
import { useGetEventAttendees } from "@/hooks";
import { TAttendee } from "@/types";
import Link from "next/link";
import { cn } from "@/lib";

export function EventSpeakers({
  eventId,
  formattedAttendees,
  changeMajorActiveState
}: {
   changeMajorActiveState: (n: number) => void;
  eventId: string;
  formattedAttendees: TAttendee[]
}) {
 
  const [selectedAttendee, setSelectedAttendee] = useState<TAttendee | null>(
    null
  );

  const [active, setActive] = useState(1);

  function setAttendee(attendee: TAttendee) {
    setSelectedAttendee(attendee);
  }

  function changeActiveState(active: number) {
    setActive(active);
  }


  /**
    <Button
          onClick={() => changeMajorActiveState(1)}
          className="px-0 h-fit w-fit  bg-none  "
        >
          <ArrowBack className="px-1" size={22} />
          <span>Back</span>
        </Button>
   */
  return (
    <div className="w-full  bg-white">
      <div
        className={cn(
          "w-full rounded-lg  px-2 hidden",
          active === 1 && "block"
        )}
      >
        <Button
          onClick={() => changeMajorActiveState(1)}
          className="px-0 mt-2 ml-2 h-fit w-fit  bg-none  "
        >
          <ArrowBack className="px-1" size={22} />
          <span>Back</span>
        </Button>

        <h3 className="pb-2 w-full invisible text-center">Event Speakers</h3>

       
          <div className=" w-full grid grid-cols-1 sm:grid-cols-2 sm:flex  gap-4 items-center flex-wrap justify-center p-4 sm:p-6">
           
            { formattedAttendees?.length === 0 && (
              <div className="col-span-full h-[200px] flex items-center justify-center">
                <p className="text-mobile sm:text-sm font-semibold">
                  No Speaker
                </p>
              </div>
            )}
            {
              Array.isArray(formattedAttendees) &&
              formattedAttendees.map((attendee) => (
                <SpeakerWidget
                  key={attendee?.id}
                  changeActiveState={changeActiveState}
                
                  attendee={attendee}
                  setAttendee={setAttendee}
                />
              ))}
          </div>
     
      </div>
      {active === 2 && selectedAttendee && (
        <SpeakerInfo
          attendee={selectedAttendee}
          changeActiveState={changeActiveState}
        />
      )}
    </div>
  );
}

export function SpeakerWidget({
  changeActiveState,

  attendee,
  setAttendee,
  className
}: {
  changeActiveState?: (v: number) => void;
className?:string;
  attendee: TAttendee;
  setAttendee?: (a: TAttendee) => void;
}) {
  // attendee?.ticketType
  return (
    <>
      <div
        onClick={() => {
          changeActiveState?.(2);
          if (setAttendee) setAttendee(attendee);
        }}
        role="button"
        className={cn("w-full sm:w-[250px] flex flex-col gap-y-2 items-center justify-center p-4", className)}
      >
        {attendee?.profilePicture ? (
          <Image
            src={
              attendee?.profilePicture ||
              "/b92cf7b1b06acc1b9a0759b6f97724c349488816.webp"
            }
            width={300}
            height={300}
            className="rounded-full object-cover w-24 h-24"
            alt="speaker"
          />
        ) : (
          <div className="w-24 bg-gray-100 h-24 rounded-full flex items-center justify-center">
            <p className="text-gray-700 text-3xl uppercase">{`${attendee?.firstName
              ?.split(" ")[0]
              .charAt(0)}${attendee?.lastName?.split(" ")[0].charAt(0)}`}</p>
          </div>
        )}

        <div className="flex w-full items-center flex-col justify-center">
          <h2 className="font-medium capitalize text-center text-ellipsis whitespace-nowrap overflow-hidden text-lg">{`${attendee?.firstName} ${attendee?.lastName}`}</h2>
          <p className="text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden">{attendee?.jobTitle ?? ""}</p>
          <p className="text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden">{attendee?.organization ?? ""}</p>
        </div>

        {/* {isViewProfile && (
          <Button
            onClick={() => {
              changeActiveState(2);
              if (setAttendee) setAttendee(attendee);
            }}
            className="px-0 h-fit w-fit  bg-none  text-mobile"
          >
            <span className="text-basePrimary">View Profile</span>
          </Button>
        )} */}
      </div>
    </>
  );
}

function SpeakerInfo({
  changeActiveState,
  attendee,
}: {
  changeActiveState: (v: number) => void;
  attendee: TAttendee;
}) {
  const removeComma = useMemo(() => {
    return attendee?.city === null || attendee?.country === null;
  }, [attendee?.city, attendee?.country]);

  const isUnavailable = useMemo(() => {
    if (attendee) {
      return (
        !attendee.x &&
        !attendee?.facebook &&
        attendee?.linkedin &&
        !attendee?.instagram
      );
    } else {
      return false;
    }
  }, [attendee]);
  return (
    <div className="w-full px-3 py-4 flex flex-col gap-y-4 items-start justify-start">
      <Button
        onClick={() => changeActiveState(1)}
        className="px-0 h-fit w-fit  bg-none  "
      >
        <ArrowBack className="px-1" size={22} />
        <span>Back</span>
      </Button>

      <div className="flex flex-col md:flex-row gap-4 items-center md:items-start w-full">
        <SpeakerWidget
          attendee={attendee}
          changeActiveState={changeActiveState}
        />

        <div className="w-full md:w-[70%] flex flex-col gap-y-2 items-start justify-start pb-4 border rounded-lg">
          <h2 className="px-3 font-semibold w-full border-b py-3">About </h2>

          <div className="px-3 flex flex-col gap-y-2 mt-2 items-start justify-start">
            <div className="flex flex-wrap w-full text-mobile text-gray-600 items-start justify-start">
              {attendee?.bio ?? ""}
            </div>
          </div>

          <div className="px-3 flex flex-col gap-y-2 mt-2 items-start justify-start">
            <h2 className=" font-semibold ">Location</h2>
            <div className="flex flex-wrap w-full text-mobile text-gray-600 items-start justify-start">
              <p className="flex items-center ">
                {`${attendee?.city ?? ""}`}
                {!removeComma && <span>,</span>}
                <span className="ml-1">{`${attendee?.country ?? ""}`}</span>
              </p>
            </div>
          </div>

          <div
            className={cn(
              "px-3 flex flex-col gap-y-2 mt-2 items-start justify-start",
              isUnavailable && "hidden"
            )}
          >
            <h2 className=" font-semibold ">Social Media</h2>
            <div className="flex items-center gap-x-3">
              {attendee?.x && (
                <Link href={attendee?.x ? attendee?.x : ""}>
                  <TwitterIcon />
                </Link>
              )}
              {attendee?.linkedin && (
                <Link href={attendee?.linkedin ? attendee?.linkedin : ""}>
                  <LinkedinIcon />
                </Link>
              )}

              {attendee?.facebook && (
                <Link href={attendee?.facebook ? attendee?.facebook : ""}>
                  <FacebookIcon />
                </Link>
              )}
              {attendee?.instagram && (
                <Link href={attendee?.instagram ? attendee?.instagram : ""}>
                  <InstagramIcon />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}