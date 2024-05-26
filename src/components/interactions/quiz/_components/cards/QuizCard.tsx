"use client";

import { Button } from "@/components";
import { Switch } from "@/components/ui/switch";
import { useState, useMemo } from "react";
import { ThreeDotsVertical } from "styled-icons/bootstrap";
import { CopyQuiz, DeleteQuiz } from "..";
import Image from "next/image";
import { QUser, QUsers } from "@/constants";
import { useRouter } from "next/navigation";
import { TQuiz, TQuestion } from "@/types";

export function QuizCard({
  quiz,
  refetch,
}: {
  refetch: () => Promise<any>;
  quiz: TQuiz<TQuestion[]>;
}) {
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();

  const points = useMemo(() => {
    // MAP AND SOME ALL POINTS
    if (Array.isArray(quiz?.questions) && quiz?.questions?.length > 0) {
      const allPoints = quiz?.questions?.map(({ points }) => Number(points));
      const sumOfPoints = allPoints.reduce((sum, point) => sum + point, 0);
      return sumOfPoints;
    } else {
      return 0;
    }
  }, [quiz]);

  function onClose() {
    setOpen((prev) => !prev);
  }
  return (
    <div
      onClick={() =>
        router.push(
          `/event/${quiz?.eventAlias}/interaction/quiz/${quiz?.quizAlias}`
        )
      }
      role="button"
      className="w-full text-mobile  sm:text-sm bg-white rounded-md flex flex-col items-start justify-start"
    >
      <div className="w-full relative">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="px-0 p-1 bg-gray-200/50 w-fit absolute right-2 top-3 h-fit"
        >
          <ThreeDotsVertical size={20} />
          {isOpen && (
            <ActionModal refetch={refetch} close={onClose} quiz={quiz} />
          )}
        </Button>
        {quiz?.coverImage ? (
          <Image
            className="w-full rounded-t-md h-48 object-cover"
            alt="quiz"
            src={quiz?.coverImage}
            width={400}
            height={400}
          />
        ) : (
          <div className="w-full rounded-t-md h-48 animate-pulse bg-gray-200">
            {" "}
          </div>
        )}
      </div>
      <div className="w-full flex flex-col rounded-b-md items-start justify-start gap-y-3 border-x border-b">
        <p className="font-medium px-3 pt-3 w-full line-clamp-2">
          {quiz?.coverTitle}
        </p>
        <div className="text-gray-500 px-3 pb-3 text-xs ms:text-mobile flex items-center justify-between w-full">
          <p className="flex items-center gap-x-2">
            <span className="border-r pr-2 border-gray-500">{`${
              quiz?.questions?.length || 0
            } ${quiz?.questions?.length > 1 ? "Questions" : "Question"}`}</span>
            <span>{`${points} ${points > 0 ? `points` : `point`}`}</span>
          </p>
          <p className="flex items-center gap-x-1">
            <QUsers />
            <span>{quiz?.quizParticipants?.length ?? 0}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function ActionModal({
  close,
  refetch,
  quiz,
}: {
  refetch: () => Promise<any>;
  quiz: TQuiz<TQuestion[]>;
  close: () => void;
}) {
  return (
    <>
      <div className="absolute right-0 top-8  w-[140px]">
        <Button className="fixed inset-0 bg-none h-full w-full z-[100"></Button>
        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex relative z-[50]  flex-col  py-4 items-start justify-start bg-white rounded-lg w-full h-fit shadow-lg"
        >
          <CopyQuiz quiz={quiz} refetch={refetch} />

          <div className="w-full px-4 text-xs flex items-center justify-between ">
            <p>Activate</p>
            <Switch className="data-[state=unchecked]:bg-gray-200 data-[state=checked]:bg-basePrimary" />
          </div>

          <DeleteQuiz quizAlias={quiz?.quizAlias} refetch={refetch} />
        </div>
      </div>
    </>
  );
}
