"use client";

import { Button } from "@/components";
import Image from "next/image";
import { CloseOutline } from "styled-icons/evaicons-outline";

type TAllocation = {
  [key: string]: {
    title: string;
    icon: string;
    score: number;
  };
};
export function CummulativeScoreModal({
  close,
  totalScore,
  attendeepointsAllocation,
}: {
  totalScore: number;
  attendeepointsAllocation: TAllocation;
  close: () => void;
}) {
  return (
    <div
      onClick={close}
      className="w-full h-full fixed inset-0 z-[100] bg-black/40"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-[95%] max-w-2xl rounded-lg bg-white absolute m-auto inset-0 h-fit max-h-[85%] overflow-y-auto p-4"
      >
        <div className="w-full flex items-end justify-end mb-3">
          <Button onClick={close}>
            <CloseOutline size={22} />
          </Button>
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-y-4">
          <h2 className="font-semibold text-base sm:text-xl">
            Your acquired points
          </h2>

          <div className="w-full h-full bg-[#001fcc]/10 border">
            <div className="w-full bg-white p-2 flex items-center justify-between">
              <p className="font-semibold text-sm sm:text-lg">Total Points</p>
              <div className="text-white bg-basePrimary gap-x-2 font-semibold text-base sm:text-xl flex items-center justify-center p-2 rounded-md">
                <Image
                  src="/medal.png"
                  alt=""
                  className="w-fit h-fit"
                  width={40}
                  height={40}
                />
                <p>{totalScore} pts</p>
              </div>
            </div>
            <div className="w-full h-full grid grid-cols-3 sm:grid-cols-4 gap-3 p-2">
              {Object.entries(attendeepointsAllocation).map(([key, value]) => (
                <PointWidget
                  key={key}
                  points={value?.score}
                  title={value?.title}
                  icon={value?.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PointWidget({
  points,
  title,
  icon,
}: {
  points: number;
  title: string;
  icon: string;
}) {
  return (
    <div className="w-full font-medium bg-white rounded-2xl p-2 flex flex-col items-center justify-center gap-y-2 shadow">
      <div className-="w-full flex gap-x-2 items-center">
        <Image
          src="/medal.png"
          alt=""
          className="w-fit h-fit"
          width={80}
          height={80}
        />
        <p className="font-medium">{points} pts</p>
      </div>
      <Image src={icon} alt="" className="h-[28px] w-[28px]" width={100} height={100} />
      <p className="text-center">{title}</p>
    </div>
  );
}


/**
    <PointWidget
                points={10000}
                title="Checked IN for event"
                icon="/images/verified-user.png"
              />
              <PointWidget
                points={10000}
                title="Updated Profile"
                icon="/images/muser.png"
              />
              <PointWidget
                points={10000}
                title="Scheduled appointment"
                icon="/images/calendar-schedule.png"
              />
              <PointWidget
                points={10000}
                title="Exchanged Contact"
                icon="/images/outgoing-call.png"
              />
              <PointWidget
                points={10000}
                title="Added to Agenda"
                icon="/images/agenda.png"
              />
              <PointWidget
                points={10000}
                title="Rated a Session"
                icon="/images/star.png"
              />
              <PointWidget
                points={10000}
                title="Downloaded presentation file"
                icon="/images/download.png"
              />
              <PointWidget
                points={10000}
                title="Bought products"
                icon="/images/checkout.png"
              />
              <PointWidget
                points={10000}
                title="Participate in Polls"
                icon="/images/poll.png"
              />
              <PointWidget
                points={10000}
                title="Participate in Quiz"
                icon="/images/quiz.png"
              />
              <PointWidget
                points={10000}
                title="Ask a Question"
                icon="/images/chat-question.png"
              />
              <PointWidget
                points={10000}
                title="Like a Question"
                icon="/images/love.png"
              />
              <PointWidget
                points={10000}
                title="Visit Exhibitor Booth"
                icon="/images/ticket-booth.png"
              />
              <PointWidget
                points={10000}
                title="Engage in Discussions"
                icon="/images/discussion.png"
              />
              <PointWidget
                points={10000}
                title="Exhibitor Catalogue"
                icon="/images/catalogue.png"
              />
              <PointWidget
                points={10000}
                title="Checked IN for session"
                icon="/images/verified-user.png"
              />
              <PointWidget
                points={10000}
                title="Share on social media"
                icon="/images/share.png"
              />
 */