"use client";

import { Button } from "@/components";
import { TQuiz, TQuestion, TQuizParticipant } from "@/types";
import { ArrowBackOutline } from "styled-icons/evaicons-outline";
import Image from "next/image";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { cn } from "@/lib";
import { useEffect, useMemo, useState } from "react";
import { useUpdateQuiz } from "@/hooks";
import { QLUsers } from "@/constants";
import Avatar from "react-nice-avatar";
export function QuizLobby({
  quiz,
  close,
  goBack,
  isAttendee,
  refetch,
}: {
  close: () => void;
  goBack: () => void;
  quiz: TQuiz<TQuestion[]>;
  isAttendee: boolean;
  refetch: () => Promise<any>;
}) {
  const [loading, setLoading] = useState(false);
  const { updateQuiz } = useUpdateQuiz();
  const [players, setPlayers] = useState<TQuizParticipant[]>([]);

  useEffect(() => {
    (() => {
      if (
        Array.isArray(quiz?.quizParticipants) &&
        quiz?.quizParticipants?.length > 0
      ) {
        const filtered = quiz?.quizParticipants?.filter(
          (participant) =>
            new Date(participant?.joinedAt).getTime() >
            new Date(quiz?.liveMode?.startingAt).getTime()
        );

        setPlayers(filtered);
      }
    })();
  }, [quiz]);

  // for an attendee
  useEffect(() => {
    if (isAttendee && quiz?.liveMode?.isStarting) {
      close();
    }
  }, [quiz]);

  async function openQuestion() {
    setLoading(true);
    const { startingAt } = quiz?.liveMode;
    const payload: Partial<TQuiz<TQuestion[]>> = {
      ...quiz,
      liveMode: { startingAt, isStarting: true },
    };
    await updateQuiz({ payload });
    refetch();
    close();
  }
  //  px-4 sm:px-8
  return (
    <div
      className={cn(
        "w-full bg-white h-[90vh] relative border-x flex flex-col gap-y-8 items-center py-8 col-span-5 ",
        isAttendee && "col-span-full"
      )}
    >
      <div className="px-4  w-full flex items-center justify-between">
        <Button
          onClick={goBack}
          className="gap-x-1 self-start w-fit h-fit px-0"
        >
          <ArrowBackOutline size={20} />
          <p className="text-sm">Exit Quiz</p>
        </Button>
        <h2 className="font-semibold text-base  sm:text-xl text-basePrimary">
          {quiz?.coverTitle ?? ""}
        </h2>
        <p className="w-1 h-1"></p>
      </div>
      <div className="w-full ">
        <div className=" flex w-full  px-3 py-3 items-center justify-between">
          <div className="flex items-center w-fit  gap-x-2 rounded-3xl p-1 bg-[#001fcc]/20">
            <div className="h-7 w-7 rounded-full flex items-center justify-center bg-basePrimary">
              <QLUsers />
            </div>
            <p className="text-basePrimary pr-1 font-semibold texts-sm">
              {players?.length || 0}
            </p>
          </div>
          <h2 className=" w-full text-center">Waiting for Players to Join</h2>
          <p className="w-1 h-1"></p>
        </div>

        <div
          className={cn(
            "w-full grid grid-cols-1 px-4 py-6  gap-3 sm:grid-cols-2 md:grid-cols-4",
            isAttendee && "md:grid-cols-4 lg:grid-cols-5"
          )}
        >
          {players?.map((player) => (
            <div
              key={player?.id}
              className="w-full rounded-3xl quiz-lobby swipeDown bg-[#001FCC]/10 p-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-x-2">
                <Avatar
                  shape="circle"
                  className="w-[40px] h-[40px]"
                  {...player?.participantImage}
                />
                <p>{player?.nickName ?? ""}</p>
              </div>
              <p className="text-mobile bg-basePrimary/20 px-2 py-1 rounded-3xl">
                Joined
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-center absolute inset-x-0 bottom-0 gap-y-3  mx-auto bg-white py-2">
        {!isAttendee && (
          <Button
            onClick={openQuestion}
            className="bg-basePrimary gap-x-2 px-10 h-12 w-fit rounded-lg text-gray-50 transform transition-all duration-400 "
          >
            {loading && <LoaderAlt size={22} className="animate-spin" />}
            Start Quiz
          </Button>
        )}

        {quiz.branding.poweredBy && (
          <p className="text-center">Powered by Zikoro</p>
        )}
      </div>
    </div>
  );
}
