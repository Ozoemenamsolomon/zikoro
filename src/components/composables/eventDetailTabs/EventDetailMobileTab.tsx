"use client";

import { Bag } from "@styled-icons/bootstrap/Bag";
import { Handshake } from "@styled-icons/fa-regular/Handshake";
import { useRouter } from "next/navigation";
import {
  MarketingIcon,
  AttendeesIcon,
  MobileAgendaIcon,
  RewardIcon,
  LeaderBoardIcon,
  DiscussionIcon,
  SocialWallIcon,
  UserPointIcon,
  ImageIcon,
  SpeakerIcon,
  StampCardIcon,
  MapIcon,
  FileIcon,
  ResourcesIcon,
  PollIcon,
  QAIcon,
} from "@/constants";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export function EventDetailMobileTab({
  changeActiveState,
  eventId,
}: {
  changeActiveState: (n: number) => void;
  eventId: string;
}) {
  const router = useRouter();

  const settings = {
    dots: true,
    infinite: true,
    autoplay: false,
    fade: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="w-full pb-24 block sm:hidden">
      <div className="sm:hidden w-full mb-8 grid grid-cols-3 gap-8 items-center justify-center">
        <button
          onClick={() => router.push(`/event/${eventId}/partners?p=sponsors`)}
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <Handshake size={22} />
          <p>Partners</p>
        </button>
        <button
          onClick={() => changeActiveState(3)}
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <SpeakerIcon />
          <p>Speakers</p>
        </button>
        <button
          onClick={() => router.push(`/event/${eventId}/market-place/jobs`)}
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <Bag size={22} />
          <p>Jobs</p>
        </button>

        <button
          onClick={() => router.push(`/event/${eventId}/market-place/offers`)}
          className="flex flex-col gap-y-2 items-center justify-center"
        >
          <MarketingIcon color="#000000" />
          <p>Offers</p>
        </button>

        <button className="flex flex-col gap-y-2 items-center justify-center">
          <AttendeesIcon />
          <p>Attendees</p>
        </button>
        <button className="flex flex-col gap-y-2 items-center justify-center">
          <MobileAgendaIcon />
          <p>Agenda</p>
        </button>

        <button className="flex flex-col gap-y-2 items-center justify-center">
          <ImageIcon />
          <p>Photo</p>
        </button>

        <button className="flex flex-col gap-y-2 items-center justify-center">
          <DiscussionIcon />
          <p>Discussion</p>
        </button>
        <button className="flex flex-col gap-y-2 items-center justify-center">
          <SocialWallIcon />
          <p>Social Wall</p>
        </button>
        <button className="flex flex-col gap-y-2 items-center justify-center">
          <UserPointIcon />
          <p>My Points</p>
        </button>
        <button className="flex flex-col gap-y-2 items-center justify-center">
          <LeaderBoardIcon />
          <p>LeaderBoard</p>
        </button>

        <button className="flex flex-col gap-y-2 items-center justify-center">
          <RewardIcon />
          <p>Reward</p>
        </button>
      </div>

      <div className="sm:hidden w-full mb-8 grid grid-cols-3 gap-8 items-center justify-center">
        <button 
         onClick={() => router.push(`/event/${eventId}/interaction/stamp-card`)}
        className="flex flex-col gap-y-2 items-center justify-center">
          <StampCardIcon />
          <p>StampCard</p>
        </button>

        <button className="flex flex-col gap-y-2 items-center justify-center">
          <MapIcon />
          <p>Map</p>
        </button>
        <button className="flex flex-col gap-y-2 items-center justify-center">
          <FileIcon />
          <p>Files</p>
        </button>

        <button className="flex flex-col gap-y-2 items-center justify-center">
          <ResourcesIcon />
          <p>Resources</p>
        </button>

        <button className="flex flex-col gap-y-2 items-center justify-center">
          <PollIcon />
          <p>Poll</p>
        </button>
        <button className="flex flex-col gap-y-2 items-center justify-center">
          <QAIcon />
          <p>Q & A</p>
        </button>
      </div>
    </div>
  );
}
