"use client";

import { Minimize2 } from "styled-icons/feather";
import { Button } from "@/components";
import { cn } from "@/lib";
import { useMemo, useEffect } from "react";
import { TAnswer, TQuestion, TQuiz } from "@/types";
import { QUser } from "@/constants";
import Avatar from "react-nice-avatar";
import { AvatarFullConfig } from "react-nice-avatar";
import { ArrowUpwardOutline } from "styled-icons/evaicons-outline";

type TLeaderBoard = {
  quizParticipantId: string;
  attendeeName: string;
  image: Required<AvatarFullConfig>;
  totalScore: number;
  recentScore: number;
};

interface TParticipantScores {
  quizParticipantId: string;
  attendeeName: string;
  image: Required<AvatarFullConfig>;
  totalScore: number;
  recentScore: number;
  recentAt: Date;
}
export function LeaderBoard({
  isRightBox,
  isLeftBox,
  close,
  answers,
  quiz,
}: {
  isLeftBox: boolean;
  isRightBox: boolean;
  close: () => void;
  answers: TAnswer[];
  quiz: TQuiz<TQuestion[]>;
}) {
  //console.log(answers);
  const board = useMemo(() => {
    const participantGroup: { [key: string]: TParticipantScores } = {};
    if (Array.isArray(answers) && answers.length > 0) {
      const filteredAnswers = answers?.filter((item) => {
        const quizStart = new Date(quiz?.liveMode?.startingAt).getTime();
        const answerCreated = new Date(item?.created_at).getTime();
        const isQuizLive = quiz?.accessibility?.live;
        if (isQuizLive) {
          return answerCreated > quizStart;
        } else {
          return true;
        }
      });
      filteredAnswers?.forEach((ans) => {
        const key = ans?.quizParticipantId;
        const createdAt = new Date(ans?.created_at);
        if (!participantGroup[key]) {
          participantGroup[key] = {
            quizParticipantId: ans?.quizParticipantId,
            attendeeName: ans?.attendeeName,
            image: ans?.avatar,
            recentAt: createdAt,
            recentScore: Number(ans?.attendeePoints),
            totalScore: 0,
          };
        }
        participantGroup[key].totalScore += Number(ans?.attendeePoints);

        if (createdAt > participantGroup[key].recentAt) {
          participantGroup[key].recentScore = Number(ans?.attendeePoints);
          participantGroup[key].recentAt = createdAt;
        }
      });

      const result: TLeaderBoard[] = Object.entries(participantGroup).map(
        ([quizParticipantId, data]) => ({
          quizParticipantId: data?.quizParticipantId,
          attendeeName: data?.attendeeName,
          image: data?.image,
          recentScore: Number(data?.recentScore),
          totalScore: data?.totalScore,
        })
      );

      const data = result.sort((a, b) => {
        return b?.totalScore - a?.totalScore;
      });

      return data;
    } else {
      return [];
    }
  }, [answers, quiz]);



  /**
   const totalMaxPoints = useMemo(() => {
    const totalPoints = quiz?.questions?.reduce((acc, cur) => {
      return acc + Number(cur?.points);
    }, 0);
    return totalPoints;
  }, [quiz]);
 */

  return (
    <div
      className={cn(
        "w-full col-span-3 bg-white h-[90vh] border-r border-y rounded-r-xl hidden  md:hidden",
        isRightBox && "block md:block ",
        !isLeftBox && "col-span-4"
      )}
    >
      <div className="w-full gap-y-2 flex bg-[#001fcc]/20 pb-2 flex-col items-center justify-center">
        <div className="flex items-center p-4 justify-between w-full">
          <h2 className="font-semibold  text-base sm:text-xl">LeaderBoard</h2>
          <div className="flex items-center gap-x-2">
            <div className="text-xs flex text-white bg-basePrimary rounded-3xl px-2 py-1 justify-center items-center gap-x-1">
              <QUser color="#ffffff" />
              <p>{board?.length || 0}</p>
            </div>
            <Button onClick={close} className="px-0 h-fit w-fit">
              <Minimize2 size={20} />
            </Button>
          </div>
        </div>

        {Array.isArray(board) && board?.length > 0 && (
          <div className="flex items-end justify-center">
            <div
              className={cn(
                "flex items-center quiz-player-animation flex-col gap-y-1 justify-center invisible",
                board[1]?.attendeeName && "flex visible"
              )}
            >
              {/**2nd */}
              <p className="font-semibold text-lg mb-1">2nd</p>
              {/*    <Image
                className="w-[4.0rem] h-[4.0rem]"
                src="/quizattendee.png"
                width={100}
                height={100}
                alt="quizplayer"
              />*/}
              <Avatar
                shape="circle"
                className="w-[4.0rem] h-[4.0rem]"
                {...board[1]?.image}
              />
              <p className="font-medium">{board[1]?.attendeeName ?? ""}</p>
              <p className="font-medium text-gray-600">
                {(board[1]?.totalScore ?? 0)?.toFixed(0)}
              </p>
            </div>
            {/**1st */}
            <div
            
              className={cn(
                "flex items-center quiz-player-animation flex-col gap-y-1 justify-center invisible",
                board[0]?.attendeeName && "flex visible"
              )}
            >
              <p className="font-semibold text-xl mb-1">1st</p>
              {/*   <Image
                className="w-[5.5rem] h-[5.5rem]"
                src="/quizattendee.png"
                width={100}
                height={100}
                alt="quizplayer"
              />*/}
              <Avatar
                shape="circle"
                className="w-[5.5rem] h-[5.5rem]"
                {...board[0]?.image}
              />
              <p className="font-medium">{board[0]?.attendeeName ?? ""}</p>
              <p className="font-medium text-gray-600">
                {(board[0]?.totalScore ?? 0)?.toFixed(0)}
              </p>
            </div>
            {/**3rd */}
            <div
         
              className={cn(
                "flex items-center quiz-player-animation flex-col gap-y-1 justify-center invisible",
                board[2]?.attendeeName && " visible"
              )}
            >
              <p className="font-semibold text-base mb-1">3rd</p>
              {/*  <Image
                className="w-[3.5rem] h-[3.5rem]"
                src="/quizattendee.png"
                width={100}
                height={100}
                alt="quizplayer"
              />*/}
              <Avatar
                shape="circle"
                className="w-[3.5rem] h-[3.5rem]"
                {...board[2]?.image}
              />
              <p className="font-medium">{board[2]?.attendeeName ?? ""}</p>
              <p className="font-medium text-gray-600">
                {(board[2]?.totalScore ?? 0)?.toFixed(0)}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="w-full overflow-y-auto h-full pb-20 space-y-2">
        {Array.isArray(board) &&
          board.slice(3, board?.length)?.map((attendee, index) => (
            <div
              key={attendee?.quizParticipantId}
              className={cn(
                "grid grid-cols-3 items-center tranform transition-all duration-1000 ease-in-out gap-2 px-3 py-3",
                index % 2 !== 0 && "border-y bg-[#001FCC]/10"
              )}
            >
              <div className="flex items-center col-span-2 w-full gap-x-2">
                <p className="text-sm">{`${index + 4}th`}</p>

                <Avatar
                  shape="circle"
                  className="w-[2.5rem] h-[2.5rem]"
                  {...attendee?.image}
                />
                <p className="text-sm">{attendee?.attendeeName ?? ""}</p>
              </div>
              <div className="flex items-center gap-x-1">
                <p>{(attendee?.totalScore ?? 0)?.toFixed(0)}p</p>
                {attendee?.recentScore > 0 && (
                  <div className="flex text-white bg-basePrimary rounded-3xl p-1 items-center gap-x-1 text-xs">
                    <ArrowUpwardOutline size={15} />
                    <p>{attendee?.recentScore}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
