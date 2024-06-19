"use client";

import { Button } from "@/components";
import Image from "next/image";
import { ArrowBack } from "@styled-icons/boxicons-regular/ArrowBack";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
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

export function Speakers({
  changeMajorActiveState,
  eventId,
}: {
  changeMajorActiveState: (n: number) => void;
  eventId: string;
}) {
  const { attendees, isLoading } = useGetEventAttendees(eventId);

  const [active, setActive] = useState(1);

  function changeActiveState(active: number) {
    setActive(active);
  }

  const formattedAttendees = useMemo(() => {
    return attendees?.filter(({ attendeeType }) => {
      return attendeeType?.includes("speaker");
    });
  }, [attendees]);

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
    <>
      {active === 1 && (
        <div className="flex  flex-col p-4  w-full items-start justify-start sm:hidden">
          <p className="font-semibold text-base">Speakers</p>
        </div>
      )}
      {active === 1 && (
        <div className=" w-full grid grid-cols-2 sm:flex  gap-4 items-center flex-wrap justify-center p-4 sm:p-6">
          {isLoading && (
            <div className="col-span-full h-[200px] flex items-center justify-center">
              <LoaderAlt size={30} className="animate-spin" />
            </div>
          )}
          {!isLoading && formattedAttendees?.length === 0 && (
            <div className="col-span-full h-[200px] flex items-center justify-center">
              <p className="text-mobile sm:text-sm font-semibold">No Speaker</p>
            </div>
          )}
          {!isLoading &&
            Array.isArray(formattedAttendees) &&
            formattedAttendees.map((attendee) => (
              <SpeakerWidget
                key={attendee?.id}
                changeActiveState={changeActiveState}
                isViewProfile
                attendee={attendee}
                active={active}
              />
            ))}
        </div>
      )}
    </>
  );
}

function SpeakerWidget({
  changeActiveState,
  isViewProfile,
  attendee,
  active,
}: {
  changeActiveState: (v: number) => void;
  isViewProfile?: boolean;
  attendee: TAttendee;
  active?: number;
}) {
  return (
    <>
      <div className="w-full sm:w-[250px] flex flex-col gap-y-2 items-center justify-center p-4 border rounded-lg">
        <Image
          src={
            attendee?.profilePicture ||
            "/b92cf7b1b06acc1b9a0759b6f97724c349488816.webp"
          }
          width={300}
          height={300}
          className="rounded-full w-24 h-24"
          alt="speaker"
        />
        <button className=" flex items-center justify-center w-fit bg-[#20A0D8] bg-opacity-10 text-xs text-[#20A0D8] px-2 py-2 rounded-b-md">
          {attendee?.ticketType}
        </button>
        <div className="flex  items-center flex-col justify-center">
          <h2 className="font-semibold  text-lg">{`${attendee?.firstName} ${attendee?.lastName}`}</h2>
          <p className="text-gray-500">{attendee?.jobTitle ?? ""}</p>
          <p className="text-gray-500">{attendee?.organization ?? ""}</p>
        </div>

        {isViewProfile && (
          <Button
            onClick={() => changeActiveState(2)}
            className="px-0 h-fit w-fit  bg-none  text-mobile"
          >
            <span className="text-basePrimary">View Profile</span>
          </Button>
        )}
      </div>
      {active === 2 && (
        <SpeakerInfo
          attendee={attendee}
          changeActiveState={changeActiveState}
        />
      )}
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

          <div className="px-3 fle  x flex-col gap-y-2 mt-2 items-start justify-start">
            <h2 className=" font-semibold ">Social Media</h2>
            <div className="flex items-center gap-x-3">
              <Link href={attendee?.x ? attendee?.x : ""}>
                <TwitterIcon />
              </Link>
              <Link href={attendee?.linkedin ? attendee?.linkedin : ""}>
                <LinkedinIcon />
              </Link>

              <Link href={attendee?.facebook ? attendee?.facebook : ""}>
                <FacebookIcon />
              </Link>
              <Link href={attendee?.instagram ? attendee?.instagram : ""}>
                <InstagramIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
