"use client";

import { useRouter } from "next/navigation";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { isToday, isAfter, isBefore } from "date-fns";
import { cn } from "@/lib";
import { InlineIcon } from "@iconify/react";
import { useState, useMemo } from "react";
import { EventSpeakers } from "@/components/singleEventHome/_components/EventSpeaker";
import { Event, TAttendee } from "@/types";
import { getEffectiveDate } from "@/utils";

export function EventDetailMobileTab({
  eventId,
  className,
  formattedAttendees,
  event,
}: {
  eventId: string;
  className?: string;
  formattedAttendees: TAttendee[];
  event: Event;
}) {
  const router = useRouter();
  const [activeState, setActiveState] = useState(1);

  function changeMajorActiveState(n: number) {
    setActiveState(n);
  }

  const effectiveDate = useMemo(() => {
    return getEffectiveDate(event.startDateTime, event.endDateTime);
  }, [event]);

  return (
    <div className="w-full pb-24 block sm:hidden">
      <div
        className={cn(
          "sm:hidden w-full mb-8 grid grid-cols-3 gap-8 items-center justify-center",
          className,
          activeState === 2 && "hidden"
        )}
      >
        <button
          onClick={() => router.push(`/event/${eventId}/partners?p=sponsors`)}
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <InlineIcon fontSize={24} icon="ic:twotone-handshake" />
          <p>Partners</p>
        </button>
        <button
          onClick={() => changeMajorActiveState(2)}
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <InlineIcon icon="game-icons:public-speaker" fontSize={24} />
          <p>Speakers</p>
        </button>
        <button
          onClick={() => router.push(`/event/${eventId}/market-place/jobs`)}
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <InlineIcon icon="line-md:briefcase-twotone" fontSize={24} />
          <p>Jobs</p>
        </button>

        <button
          onClick={() => router.push(`/event/${eventId}/market-place/offers`)}
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <InlineIcon icon="iconamoon:gift-duotone" fontSize={24} />
          <p>Offers</p>
        </button>

        <button
          onClick={() => router.push(`/event/${eventId}/people/all`)}
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <InlineIcon icon="ph:users-duotone" fontSize={24} />
          <p>Attendees</p>
        </button>
        <button
          onClick={() =>
            router.push(
              `/event/${eventId}/agenda?date=${
                effectiveDate?.toISOString().split(".")[0]
              }&a=undefined`
            )
          }
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <InlineIcon icon="solar:calendar-mark-bold-duotone" fontSize={24} />
          <p>Agenda</p>
        </button>

        <button
          onClick={() =>
            router.push(`/event/${eventId}/engagements/interactions`)
          }
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <InlineIcon icon="ic:twotone-quiz" fontSize={24} />
          <p>Interactions</p>
        </button>

        <button
          onClick={() =>
            router.push(`/event/${eventId}/engagements/leaderboard`)
          }
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <InlineIcon icon="ph:coins-duotone" fontSize={24} />
          <p>My Points</p>
        </button>
        <button
          onClick={() =>
            router.push(`/event/${eventId}/engagements/leaderboard`)
          }
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <InlineIcon icon="ic:twotone-leaderboard" fontSize={24} />
          <p>LeaderBoard</p>
        </button>

        <button
          onClick={() => router.push(`/event/${eventId}/market-place/rewards`)}
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <InlineIcon icon="solar:cup-bold-duotone" fontSize={24} />
          <p>Reward</p>
        </button>
        <button
          onClick={() =>
            router.push(`/event/${eventId}/market-place/stamp-card`)
          }
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <InlineIcon icon="ph:stamp-duotone" fontSize={24} />
          <p>StampCard</p>
        </button>
      </div>
      {activeState === 2 && (
        <EventSpeakers
          formattedAttendees={formattedAttendees}
          changeMajorActiveState={changeMajorActiveState}
          eventId={eventId}
        />
      )}
    </div>
  );
}

/**
 * 
 * 
 * 
      <div className="sm:hidden w-full mb-8 grid grid-cols-3 gap-8 items-center justify-center">
       

     

    
      </div>
 *    <button className="hidden flex-col gap-y-2 items-center justify-center">
          <MapIcon />
          <p>Map</p>
        </button>
        <button className="hidden flex-col gap-y-2 items-center justify-center">
          <FileIcon />
          <p>Files</p>
        </button>
 *     <button className="hidden flex-col gap-y-2 items-center justify-center">
          <ResourcesIcon />
          <p>Resources</p>
        </button>

        <button className="hidden flex-col gap-y-2 items-center justify-center">
          <PollIcon />
          <p>Poll</p>
        </button>
        <button className="hidden flex-col gap-y-2 items-center justify-center">
          <QAIcon />
          <p>Q & A</p>
        </button>
     <button className="hidden flex-col gap-y-2 items-center justify-center">
          <ImageIcon />
          <p>Photo</p>
        </button>

        <button className="hidden flex-col gap-y-2 items-center justify-center">
          <DiscussionIcon />
          <p>Discussion</p>
        </button>
        <button className="hidden flex-col gap-y-2 items-center justify-center">
          <SocialWallIcon />
          <p>Social Wall</p>
        </button>
 */
