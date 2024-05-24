"use client";

import Image from "next/image";
import { Time } from "@styled-icons/ionicons-outline/Time";
import { FeedStar } from "@styled-icons/octicons/FeedStar";
import { TQuestion, TQuiz, TRefinedQuestion } from "@/types";
import { millisecondsToTime } from "@/utils";
import { useMemo } from "react";
import { cn } from "@/lib";
import { DeleteQuestion, CopyQuestion, EditQuestion } from "..";

export function QuestionCard({
  question,
  id,
  quiz,
  setActiveQuestion,
  activeQuestion,
  refetch,
}: {
  question: TRefinedQuestion;
  id: number;
  quiz: TQuiz<TRefinedQuestion[]>;
  setActiveQuestion: (q: TRefinedQuestion) => void;
  activeQuestion: TRefinedQuestion | null;
  refetch: () => Promise<any>;
}) {
  const duration = useMemo(() => {
    return millisecondsToTime(Number(question?.duration || 0));
  }, [question?.duration]);

  const actualQuiz: TQuiz<TQuestion[]> = useMemo(() => {
    return {
      ...quiz,
      questions: quiz?.questions?.map((item) => {
        return {
          ...item,
          options: item?.options?.map(({ isCorrect, ...rest }) => rest),
        };
      }),
    };
  }, [quiz]);

  return (
    <div
      onClick={() => setActiveQuestion(question)}
      role="button"
      className={cn(
        "w-full p-3 rounded-lg gap-2 grid grid-cols-7",
        activeQuestion &&
          activeQuestion?.id === question?.id &&
          "bg-basePrimary/10"
      )}
    >
      {question?.questionImage ? (
        <Image
          src={question?.questionImage}
          alt="question-image"
          width={600}
          height={400}
          className="w-full h-[140px] sm:h-[180px] rounded-lg col-span-3"
        />
      ) : (
        <div className="w-full h-[140px] sm:h-[180px] rounded-lg col-span-3 animate-pulse bg-gray-200 "></div>
      )}
      <div className="text-mobile sm:text-sm w-full flex flex-col items-start justify-start col-span-4 gap-y-3">
        <p className="text-gray-400">{`Question ${id + 1}`}</p>
        <p className="w-full line-clamp-3 font-medium leading-6">
          {question?.question ?? ""}
        </p>
        <div className="flex items-center gap-x-2">
          <div className="flex bg-basePrimary/10 px-2 py-1 items-center font-medium text-xs text-basePrimary gap-x-1">
            <p>{`${question?.points ?? "0"}pts`}</p>
            <FeedStar size={15} />
          </div>
          <div className="flex  items-center font-medium text-xs text-basePrimary gap-x-1">
            <p>{duration ?? 0}</p>
            <Time size={15} />
          </div>
          <DeleteQuestion
            refetch={refetch}
            quiz={actualQuiz}
            questionId={question?.id}
          />
          <CopyQuestion
            refetch={refetch}
            quiz={actualQuiz}
            questionId={question?.id}
          />
          <EditQuestion
          refetch={refetch}
          quiz={actualQuiz}
          
          />
        </div>
      </div>
    </div>
  );
}
