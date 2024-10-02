"use client";

import { BoothStaffWidget } from "@/components/partners/sponsors/_components";
import { Eye } from "styled-icons/feather";
import { SessionCard, Deletes, Duplicate, Edit, AddToMyAgenda } from "..";
import { Button } from "@/components";
import { CheckmarkDone } from "styled-icons/ionicons-solid";
import { Star } from "styled-icons/bootstrap";
import { LocationPin } from "styled-icons/entypo";
import Image from "next/image";
import { cn } from "@/lib";
import { useEffect, useMemo, useRef, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { TSessionAgenda, TAgenda, TMyAgenda, Event, TAttendee } from "@/types";
import { useRouter } from "next/navigation";
import { EngagementsSettings } from "@/types/engagements";
export function Custom({
  sessionAgenda,
  className,
  refetchSession,
  event,
  refetchEvent,
  attendeeId,
  isIdPresent,
  isOrganizer,
  isFullScreen,
  isReception,
  myAgendas,
  engagementsSettings,
}: {
  className?: string;
  sessionAgenda: TSessionAgenda;
  refetchSession?: () => Promise<any>;
  refetchEvent?: () => Promise<any>;
  event?: Event | null;
  attendeeId?: number;
  isIdPresent: boolean;
  isOrganizer: boolean;
  isFullScreen?: boolean;
  isReception?: boolean;
  myAgendas?: TMyAgenda[];
  engagementsSettings?: EngagementsSettings | null;
}) {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    fade: false,
    speed: 400,
    delay: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const Comp = sessionAgenda?.sessions?.length > 1 ? Slider : "div";

  return (
    <SessionCard
      timeStamp={sessionAgenda?.timeStamp}
      isGreaterThanOne={sessionAgenda?.sessions?.length > 1}
      className={className}
      isReception={isReception}
    >
      <div className="w-full ">
        <Comp className="w-full agenda-slider h-full z-4" {...settings}>
          {sessionAgenda?.sessions?.map((session, index) => (
            <Widget
              session={session}
              key={index}
              event={event}
              attendeeId={attendeeId}
              refetchEvent={refetchEvent}
              isReception={isReception}
              refetchSession={refetchSession}
              isIdPresent={isIdPresent}
              isOrganizer={isOrganizer}
              isFullScreen={isFullScreen}
              myAgendas={myAgendas}
              engagementsSettings={engagementsSettings}
            />
          ))}
        </Comp>
      </div>
    </SessionCard>
  );
}

function Widget({
  session,
  refetchSession,
  event,
  attendeeId,
  refetchEvent,
  isIdPresent,
  isOrganizer,
  isFullScreen,
  myAgendas,
  engagementsSettings,
  isReception
}: {
  session: TAgenda;
  event?: Event | null;
  refetchSession?: () => Promise<any>;
  attendeeId?: number;
  refetchEvent?: () => Promise<any>;
  isIdPresent: boolean;
  isOrganizer: boolean;
  isFullScreen?: boolean;
  myAgendas?: TMyAgenda[];
  engagementsSettings?: EngagementsSettings | null;
  isReception?:boolean;
}) {
  const router = useRouter();
  const [otherStaffsCount, setOtherStaffsCount] = useState(0);
  const [staffs, setStaffs] = useState<TAttendee[]>([]);
  const divRef = useRef<HTMLDivElement | null>(null);

  const isAddedAttendee = useMemo(() => {
    if (
      Array.isArray(session?.sessionSpeakers) &&
      Array.isArray(session?.sessionModerators)
    ) {
      return (
        session.sessionSpeakers?.length > 0 ||
        session?.sessionModerators?.length > 0
      );
    } else {
      return false;
    }
  }, [session]);

  const mergedSM = useMemo(() => {
    if (isAddedAttendee) {
      return [...session?.sessionSpeakers, ...session?.sessionModerators];
    } else {
      return [];
    }
  }, [session]);

  useEffect(() => {
    if (divRef && divRef?.current && mergedSM) {
      const width = divRef?.current?.offsetWidth;
      const staffLength = mergedSM?.length * 200;
      if (staffLength >= width) {
        const x = (staffLength - width) /200
        const willInclude = parseInt(
          Math.round(x).toFixed(0)
        );
        console.log(staffLength, width);
        setStaffs(mergedSM.slice(0, willInclude));
        setOtherStaffsCount(mergedSM?.length - willInclude);
      } else {
        setStaffs(mergedSM);
      }
    }
  }, [divRef, mergedSM]);

  return (
    <>
      <div
        ref={divRef}
        role="button"
        onClick={() => {
          if (session?.description) {
            router.push(
              `/event/${event?.eventAlias}/agenda/${session?.sessionAlias}`
            );
          }
        }}
        className={cn(
          "flex border-0 flex-col w-full  rounded-xl items-start justify-start ",
          session.isMyAgenda && " "
        )}
      >
        <h2 className="text-base w-full mb-2 text-ellipsis whitespace-nowrap overflow-hidden sm:text-xl font-medium">
          {session?.sessionTitle ?? ""}
        </h2>
        {isAddedAttendee && (
          <div className="w-full relative flex items-center mb-2  gap-1">
            {Array.isArray(staffs) &&
              staffs.map((attendee, index) => (
                <BoothStaffWidget
                  company={""}
                  image={attendee?.profilePicture || null}
                  name={`${attendee?.firstName} ${attendee?.lastName}`}
                  profession={attendee?.jobTitle ?? ""}
                  email={attendee?.email ?? ""}
                  key={index}
                  className="grid grid-cols-7 w-[180px] items-center "
                />
              ))}
            {otherStaffsCount > 0 && (
              <div className="flex absolute top-[10%] right-[0.3rem] from-custom-bg-gradient-start bg-gradient-to-tr to-custom-bg-gradient-end items-center text-lg justify-center w-[3rem] h-[3rem] rounded-full border border-basePrimary ">
                {otherStaffsCount}+
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-x-3 mb-2 ">
          {session?.sessionType && (
            <div className="w-fit px-2 py-2 bg-gradient-to-tr border rounded-2xl border-[#001fcc] from-custom-bg-gradient-start to-custom-bg-gradient-end">
              <p className="gradient-text bg-basePrimary text-xs">
                {session?.sessionType ?? ""}
              </p>
            </div>
          )}

          {session?.Track && (
            <button className="bg-[#F44444]/10 text-xs border text-[#F44444] border-[#F44444] px-2 py-2 rounded-2xl">
              {session?.Track ?? ""}
            </button>
          )}
          {session?.sessionVenue && (
            <div className="flex items-center gap-x-1">
              <LocationPin size={20} />
              <p>{session?.sessionVenue ?? ""}</p>
            </div>
          )}
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-x-3"
          >
            <AddToMyAgenda
              attendeeId={attendeeId}
              isMyAgenda={session?.isMyAgenda}
              sessionAlias={session?.sessionAlias}
              refetch={refetchSession}
              engagementsSettings={engagementsSettings}
              myAgendas={myAgendas}
              eventAlias={event?.eventAlias!}
            />
          </div>
        </div>
        {!isFullScreen && (isIdPresent || isOrganizer) && !isReception &&  (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center mb-2  gap-x-2"
          >
            <Edit
              session={session}
              event={event}
              refetch={refetchSession}
              refetchEvent={refetchEvent}
            />
            <Duplicate session={session} refetch={refetchSession} />
            <Deletes
              agendaId={session?.sessionAlias}
              refetch={refetchSession}
            />
            <Button className="h-fit  gap-x-2 w-fit px-0">
              <Eye size={20} />
              <p className="text-xs sm:text-sm text-gray-500">
                {session?.sessionViews ?? "0"}
              </p>
            </Button>
            <Button className="hidden h-fit gap-x-2 w-fit px-0">
              <Star size={20} />
              <div className="text-gray-500 flex items-center text-xs sm:text-sm gap-x-1">
                <p>4.5 .</p>
                <p>Reviews</p>
              </div>
            </Button>
            <div className="flex items-center gap-x-2">
              <Button className="h-fit w-fit px-0">
                <CheckmarkDone className="" size={18} />
              </Button>
              <p className="text-xs sm:text-sm">Check-in</p>
            </div>
          </div>
        )}
        {!isReception && Array.isArray(session?.sessionSponsors) &&
          session?.sessionSponsors?.length > 0 && (
            <div className="w-full flex flex-col mb-2  items-start justify-start gap-y-2">
              <p>Sponsors</p>

              <div className="w-full flex flex-wrap items-start gap-4">
                {Array.isArray(session?.sessionSponsors) &&
                  session?.sessionSponsors.map((sponsor) => (
                    <Image
                      src={sponsor?.companyLogo ?? ""}
                      alt="sponsor"
                      width={200}
                      height={100}
                      className=" w-[100px] object-contain h-[40px]"
                    />
                  ))}
              </div>
            </div>
          )}
      </div>
    </>
  );
}
