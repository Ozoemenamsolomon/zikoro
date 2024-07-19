"use client";

import { useGetData } from "@/hooks/services/request";
import { InteractionLayout } from "../_components";
import { useMemo, useState, useEffect } from "react";
import { TAttendee } from "@/types";
import { Button } from "@/components";
import { useVerifyUserAccess, useCheckTeamMember } from "@/hooks";
import { cn } from "@/lib";
import Image from "next/image";
import { CummulativeScoreModal } from "./_components/CummulativeScoreModal";

type TAttendeeGroup = TAttendee & {
  points: number;
};
type TBoardData = { [key: string]: any[] };

type TAllocation = {
  [key: string]: {
    title: string;
    icon: string;
    score: number;
  };
};

let pointsAllocation: TAllocation = {
  checkInAttendees: {
    title: "Checked IN for event",
    icon: "/images/verified-user.png",
    score: 0,
  },
  attendeeProfile: {
    title: "Updated Profile",
    icon: "/images/muser.png",
    score: 0,
  },
  appointments: {
    title: "Scheduled appointment",
    icon: "/images/calendar-schedule.png",
    score: 0,
  },
  contacts: {
    title: "Exchanged Contact",
    icon: "/images/outgoing-call.png",
    score: 0,
  },
  myAgenda: {
    title: "Added to Agenda",
    icon: "/images/agenda.png",
    score: 0,
  },
  sessionReviews: {
    title: "Rated a Session",
    icon: "/images/star.png",
    score: 0,
  },
  presentationFile: {
    title: "Downloaded presentation file",
    icon: "/images/download.png",
    score: 0,
  },
  leadsInterests: {
    title: "Bought products",
    icon: "/images/checkout.png",
    score: 0,
  },
  polls: {
    title: "Participate in Polls",
    icon: "/images/poll.png",
    score: 0,
  },
  quizAnswer: {
    title: "Participate in Quiz",
    icon: "/images/quiz.png",
    score: 0,
  },
  askQuestion: {
    title: "Ask a Question",
    icon: "/images/chat-question.png",
    score: 0,
  },
  likeQuestion: {
    title: "Like a Question",
    icon: "/images/love.png",
    score: 0,
  },

  Leads: {
    title: "Visit Exhibitor Booth",
    icon: "/images/ticket-booth.png",
    score: 0,
  },
  discussions: {
    title: "Engage in Discussions",
    icon: "/images/discussion.png",
    score: 0,
  },
  exhibitorCatalogue: {
    title: "Exhibitor Catalogue",
    icon: "/images/catalogue.png",
    score: 0,
  },
  checkedInForSession: {
    title: "Checked IN for session",
    icon: "/images/verified-user.png",
    score: 0,
  },
  shareOnSocialMedia: {
    title: "Share on social media",
    icon: "/images/share.png",
    score: 0,
  },
};

export default function LeaderBoard({ eventId }: { eventId: string }) {
  const { isOrganizer, attendeeId } = useVerifyUserAccess(eventId);
  const [totalScore, setTotalScore] = useState(0);
  const [ranks, setRanks] = useState<TAttendeeGroup[]>([]);
  const [attendeepointsAllocation, setAttendeesAllocation] =
    useState(pointsAllocation);
  const [isOpen, setOpen] = useState(false);
  // const divRef = useRef<HTMLDivElement | null>(null);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const { data } = useGetData<TBoardData>(
    `/engagements/${eventId}/leaderboard`
  );

  function onClose() {
    setOpen((prev) => !prev);
  }

  const attendeeGroup: { [key: string]: TAttendeeGroup } = {};
  useEffect(() => {
    if (data) {
      const allData = Object.values(data).flat();
      console.log(allData);
      allData.forEach((attendee) => {
        const key = attendee?.id;
        if (!attendeeGroup[key]) {
          attendeeGroup[key] = { ...attendee, points: 0 };
        }
        attendeeGroup[key].points += attendee?.points || 0;
      });

      const result = Object.entries(attendeeGroup)?.map(([id, data]) => ({
        ...data,
      }));

      const sortedResult = result.sort((a, b) => b.points - a.points);
      setRanks(sortedResult);
    }
  }, [data]);

  useEffect(() => {
    if (data && attendeeId) {
      let total = 0;
      Object.entries(data)?.forEach(([key, value]) => {
        const sum = value
          ?.filter((item) => Number(item?.id) === attendeeId)
          ?.reduce((acc, val) => acc + (val?.points || 0), 0);

        pointsAllocation[key].score = sum;
        setAttendeesAllocation({
          ...attendeepointsAllocation,
          [key]: {
            ...attendeepointsAllocation[key],
            score: (attendeepointsAllocation[key].score = sum),
          },
        });
        total += sum;
      });
      setTotalScore(total);
    }
  }, [data, attendeeId]);

  // console.log( data, ranks, pointsAllocation);

  return (
    <InteractionLayout eventId={eventId}>
      <div className="w-full mx-auto relative pt-8 bg-[url('/scoresheetbg.png')]  min-h-screen overflow-hidden">
        <div className="w-full mx-auto max-w-3xl h-full relative">
          <h2 className="w-full text-white  text-center mb-3 font-semibold text-lg sm:text-2xl">
            LeaderBoard
          </h2>
          {!isOrganizer && !isIdPresent && (
            <div className="mx-auto w-fit flex px-2 mb-6 items-center gap-x-8 sm:gap-x-20 bg-white h-10 rounded-3xl">
              <Button
                onClick={onClose}
                className="underline rounded-none px-2 h-10 w-fit"
              >
                View your Points
              </Button>
            </div>
          )}
          <div className="mx-auto w-full relative">
            {Array.isArray(ranks) && ranks?.length > 0 && (
              <div className=" flex w-full justify-center text-sm">
                <div
                  className={cn(
                    "flex invisible flex-col relative left-11  mt-8 gap-y-4 justify-center",
                    ranks[1]?.firstName && "visible"
                  )}
                >
                  <div className="flex flex-col mr-11 items-center justify-center gap-y-2">
                    {ranks[1]?.profilePicture ? (
                      <Image
                        src={ranks[1]?.profilePicture}
                        className=" size-[5rem]"
                        alt=""
                        width={150}
                        height={150}
                      />
                    ) : (
                      <div className="w-[5rem] h-[5rem]  bg-gray-100  rounded-full flex items-center justify-center">
                        <p className="text-gray-700 text-2xl uppercase">{`${ranks[1]?.firstName.charAt(
                          0
                        )}${ranks[1]?.lastName.charAt(0)}`}</p>
                      </div>
                    )}

                    <p className="text-white font-medium">
                      {`${ranks[1]?.firstName.charAt(0)}. ${
                        ranks[1]?.lastName
                      }` ?? ""}
                    </p>
                  </div>

                  <div className="w-[11.2rem]  relative h-fit">
                    <Image
                      src="/secondp.png"
                      className="w-[11.2rem]  object-cover"
                      alt=""
                      width={150}
                      height={500}
                    />
                    <div className="absolute mr-11 inset-x-0 top-10 text-white mx-auto flex flex-col items-center justify-center">
                      <p className="font-medium">2nd</p>
                      <p className="text-tiny bg-white/20 rounded-3xl px-3 py-1">{`${
                        ranks[1]?.points?.toFixed(0) ?? 0
                      }p`}</p>
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex flex-col relative z-30 gap-y-4 justify-center invisible",
                    ranks[0]?.firstName && "visible"
                  )}
                >
                  <div className="flex flex-col items-center justify-center gap-y-2">
                    {ranks[0]?.profilePicture ? (
                      <Image
                        src={ranks[0]?.profilePicture}
                        className="w-[5rem] h-[5rem] "
                        alt=""
                        width={150}
                        height={150}
                      />
                    ) : (
                      <div className="size-[5rem] bg-gray-100  rounded-full flex items-center justify-center">
                        <p className="text-gray-700 text-2xl uppercase">{`${ranks[0]?.firstName.charAt(
                          0
                        )}${ranks[0]?.lastName.charAt(0)}`}</p>
                      </div>
                    )}

                    <p className="text-white font-medium text-sm">
                      {`${ranks[0]?.firstName.charAt(0)}. ${
                        ranks[0]?.lastName
                      }` ?? ""}
                    </p>
                  </div>

                  <div className="w-[11.2rem]  relative h-fit">
                    <Image
                      src="/firstp.png"
                      className="w-[11.2rem] object-cover"
                      alt=""
                      width={150}
                      height={500}
                    />
                    <div className="absolute inset-x-0 top-10 text-white mx-auto flex flex-col items-center justify-center">
                      <p className="font-medium text-sm">1st</p>
                      <p className="text-tiny bg-white/20 rounded-3xl px-3 py-1">{`${
                        ranks[0]?.points.toFixed(0) ?? 0
                      }p`}</p>
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex flex-col relative right-11 mt-10 gap-y-4 justify-center invisible",
                    ranks[2]?.firstName && "visible"
                  )}
                >
                  <div className="flex flex-col ml-11 items-center justify-center gap-y-2">
                    {ranks[2]?.profilePicture ? (
                      <Image
                        src={ranks[2]?.profilePicture}
                        className=" w-[5rem] h-[5rem]"
                        alt=""
                        width={150}
                        height={150}
                      />
                    ) : (
                      <div className="size-[5rem] bg-gray-100 rounded-full flex items-center justify-center">
                        <p className="text-gray-700 text-2xl uppercase">{`${ranks[2]?.firstName.charAt(
                          0
                        )}${ranks[2]?.lastName.charAt(0)}`}</p>
                      </div>
                    )}

                    <p className="text-white font-medium">
                      {`${ranks[2]?.firstName.charAt(0)}. ${
                        ranks[2]?.lastName
                      }` ?? ""}
                    </p>
                  </div>

                  <div className="w-[11.2rem] relative h-fit">
                    <Image
                      src="/thirdp.png"
                      className="w-[11.2rem] object-cover"
                      alt=""
                      width={150}
                      height={500}
                    />
                    <div className="absolute inset-x-0 ml-11 top-10 text-white mx-auto flex flex-col items-center justify-center">
                      <p className="font-medium">3rd</p>
                      <p className="text-tiny bg-white/20 rounded-3xl px-3 py-1">{`${
                        ranks[2]?.points.toFixed(0) ?? 0
                      }p`}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/** */}

            <div className="w-full overflow-y-auto h-[50vh] pb-20 no-scrollbar z-50 bg-white absolute inset-x-0 top-80 rounded-t-lg py-6 px-8">
              <div className="w-full flex flex-col items-start justify-start">
                {Array.isArray(ranks) &&
                  ranks.slice(3, ranks?.length).map((attendee, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3 items-center w-full py-3 border-b px-2"
                    >
                      <div className="flex items-center col-span-2 gap-x-3">
                        <div className="flex flex-col items-center justify-center">
                          {attendee?.profilePicture ? (
                            <Image
                              src={attendee?.profilePicture}
                              className="w-[5rem]  h-[5rem]"
                              alt=""
                              width={150}
                              height={150}
                            />
                          ) : (
                            <div className="w-12 bg-gray-100 h-12 rounded-full flex items-center justify-center">
                              <p className="text-gray-700 uppercase">{`${attendee?.firstName.charAt(
                                0
                              )}${attendee?.lastName.charAt(0)}`}</p>
                            </div>
                          )}
                          <p>{`${index + 4}th`}</p>
                        </div>
                        <p className="">
                          {`${attendee?.firstName} ${attendee?.lastName}` ?? ""}
                        </p>
                      </div>
                      <div className="flex items-center justify-end gap-x-1">
                        <p className="flex items-center">
                          <span>
                            {Number(attendee?.points ?? 0).toFixed(0)}
                          </span>
                          p
                        </p>
                        {/*player?.recentScore > 0 && (
                            <div className="flex text-white bg-basePrimary rounded-3xl px-2 py-1 items-center gap-x-1 text-xs">
                              <ArrowUpwardOutline size={15} />
                              <p>{Number(player?.recentScore)?.toFixed(0)}</p>
                            </div>
                          )*/}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <CummulativeScoreModal
          totalScore={totalScore}
          close={onClose}
          attendeepointsAllocation={attendeepointsAllocation}
        />
      )}
    </InteractionLayout>
  );
}
