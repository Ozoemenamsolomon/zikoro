"use client";

import { Button } from "@/components";
import { TQuiz, TQuestion } from "@/types";
import { ArrowBackOutline } from "@styled-icons/evaicons-outline/ArrowBackOutline";
import Image from "next/image";
import {cn} from "@/lib"

export function QuizLobby({
  quiz,
  close,
  goBack,
  isAttendee,
  submit
}: {
  close: () => void;
  goBack: () => void;
  quiz: TQuiz<TQuestion[]>;
  isAttendee: boolean;
  submit:() => Promise<any>
}) {
  return (
    <div className={cn("w-full bg-white h-[90vh] border-x flex flex-col gap-y-8 items-center py-8 px-4 col-span-5 sm:px-8",isAttendee && "col-span-full" )}>
      <Button onClick={goBack} className="gap-x-1 self-start w-fit h-fit px-2">
        <ArrowBackOutline size={20} />
        <p className="text-sm">Exit Quiz</p>
      </Button>
      <h2 className="font-semibold text-base sm:text-xl text-basePrimary">
        {quiz?.coverTitle ?? ""}
      </h2>

      <div className="w-full max-w-[80%] mx-auto rounded-t-lg border">
        <h2 className="border-b w-full text-center p-3">
          Waiting for Players to Join
        </h2>

        <div className={cn("w-full grid grid-cols-1 px-4 py-6 sm:grid-cols-1 md:grid-cols-1", isAttendee && "md:grid-cols-3")}>
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              <Image
                src="/quizattendee.png"
                alt=""
                className="w-[40px] h-[40px]"
                width={40}
                height={40}
              />
              <p>Lakers</p>
            </div>
            <p className="text-mobile bg-basePrimary/20 px-2 py-1 rounded-3xl">Joined</p>
          </div>
        </div>
      </div>

      <Button
        onClick={close}
        className="bg-basePrimary px-10 h-12 rounded-lg text-gray-50 transform transition-all duration-400 "
      >
        Start Quiz
      </Button>

      <p className="text-center">Powered by Zikoro</p>
    </div>
  );
}
