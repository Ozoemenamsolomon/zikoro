"use client";

import { BoothStaffWidget } from "@/components/partners/sponsors/_components";
import { Eye } from "@styled-icons/feather/Eye";
import { SessionCard, Deletes, Duplicate, Edit,AddToMyAgenda } from "..";
import { Button } from "@/components";
import { CheckmarkDone } from "@styled-icons/ionicons-solid/CheckmarkDone";
import { Star } from "@styled-icons/bootstrap/Star";
import { EventLocationType } from "@/components/composables";
import { LocationPin } from "@styled-icons/entypo/LocationPin";
import Image from "next/image";
import { cn } from "@/lib";
import { useMemo } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { TSessionAgenda, TAgenda, Event } from "@/types";
import { useRouter } from "next/navigation";
export function Custom({
  sessionAgenda,
  className,
  refetchSession,
  event,
  refetchEvent,
  attendeeId,
  isIdPresent,
  isOrganizer
}: {
  className?: string;
  sessionAgenda: TSessionAgenda;
  refetchSession?: () => Promise<any>;
  refetchEvent?: () => Promise<any>;
  event?: Event | null;
  attendeeId?:number;
  isIdPresent: boolean;
  isOrganizer:boolean;
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
    <SessionCard timeStamp={sessionAgenda?.timeStamp} className={className}>
      <div className="w-full md:col-span-6 lg:col-span-8 ">
        <Comp className="w-full agenda-slider h-full z-4" {...settings}>
          {sessionAgenda?.sessions?.map((session, index) => (
            <Widget
              session={session}
              key={index}
              event={event}
              attendeeId={attendeeId}
              refetchEvent={refetchEvent}
              refetchSession={refetchSession}
              isIdPresent={isIdPresent}
              isOrganizer={isOrganizer}
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
  isOrganizer
}: {
  session: TAgenda;
  event?: Event | null;
  refetchSession?: () => Promise<any>;
  attendeeId?: number;
  refetchEvent?: () => Promise<any>;
  isIdPresent:boolean;
  isOrganizer:boolean;
}) {
  const router = useRouter();

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

  return (
    <>
      <div
        role="button"
        onClick={() => {
          if (session?.description) {
            router.push(`/event/${event?.eventAlias}/agenda/${session?.id}`);
          }
        }}
        className={cn(
          "flex border-0 flex-col w-full  p-3 rounded-xl items-start justify-start "
        )}
      >
        <h2 className="text-base w-full mb-2 text-ellipsis whitespace-nowrap overflow-hidden sm:text-xl font-medium">
          {session?.sessionTitle ?? ""}
        </h2>
        {isAddedAttendee && (
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 mb-2  gap-3">
            {Array.isArray(mergedSM) &&
              mergedSM.map((attendee, index) => (
                <BoothStaffWidget
                  company={"DND"}
                  image={null}
                  name={`${attendee?.firstName} ${attendee?.lastName}`}
                  profession={"Manager"}
                  email={attendee?.email ?? ""}
                  ticketType={attendee?.ticketType ?? "Attendee"}
                  key={index}
                />
              ))}
          </div>
        )}
        <div className="flex items-center gap-x-3 mb-2 ">
          {session?.sessionType && (
            <EventLocationType locationType={session?.sessionType ?? ""} />
          )}
          {session?.sessionVenue && (
            <div className="flex items-center gap-x-1">
              <LocationPin size={20} />
              <p>{session?.sessionVenue ?? ""}</p>
            </div>
          )}
          {session?.Track && (
            <button className="bg-[#F44444]/10 text-xs text-[#F44444] px-2 py-2 rounded-md">
              {session?.Track ?? ""}
            </button>
          )}
          <div className="flex items-center gap-x-3">
          <AddToMyAgenda attendeeId={attendeeId} sessionId={session?.id}/>

           
          </div>
        </div>
     {(isIdPresent || isOrganizer) &&   <div className="flex items-center mb-2  gap-x-2">
          <Edit session={session} event={event} refetch={refetchSession} refetchEvent={refetchEvent}/>
          <Duplicate session={session} refetch={refetchSession} />
          <Deletes agendaId={session?.id} refetch={refetchSession} />
          <Button className="h-fit  gap-x-2 w-fit px-0">
            <Eye size={20} />
            <p className="text-xs sm:text-sm text-gray-500">{session?.sessionViews ?? "0"}</p>
          </Button>
          <Button className="h-fit gap-x-2 w-fit px-0">
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
        </div>}
        {Array.isArray(session?.sessionSponsors) &&
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
