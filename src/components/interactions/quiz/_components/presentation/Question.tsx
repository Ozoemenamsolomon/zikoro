"use client";

import Image from "next/image";
import { Time } from "@styled-icons/ionicons-outline/Time";
import { Option } from "..";
import { Button } from "@/components";
import { Maximize2 } from "@styled-icons/feather/Maximize2";
import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib";
import { useCreateAnswer } from "@/hooks";
import toast from "react-hot-toast";
import { TQuiz, TRefinedQuestion, TAnswer } from "@/types";
export function Qusetion({
  isRightBox,
  isLeftBox,
  toggleRightBox,
  toggleLeftBox,
  quiz,
  updateQuiz,
  attendeeDetail,
  isOrganizer,
  isIdPresent,
}: {
  isRightBox: boolean;
  isLeftBox: boolean;
  toggleLeftBox: () => void;
  toggleRightBox: () => void;
  quiz: TQuiz<TRefinedQuestion[]>;
  updateQuiz: (q: TQuiz<TRefinedQuestion[]>) => void;
  attendeeDetail: { attendeeId?: string; attendeeName: string };
  isOrganizer: boolean;
  isIdPresent: boolean;
}) {
  const [currentQuestion, setCurrentQuestion] =
    useState<TRefinedQuestion | null>(null);
  const [millisecondsLeft, setMillisecondsLeft] = useState<number>(0);
  const { createAnswer } = useCreateAnswer();

  useEffect(() => {
    if (quiz) {
      setCurrentQuestion(quiz.questions[0]);
    }
  }, [quiz]);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setMillisecondsLeft((prevMilliseconds) => {
        if (prevMilliseconds <= 1000) {
          clearInterval(countdownInterval);
          return 0;
        }

        return prevMilliseconds - 1000;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [millisecondsLeft]);

  // goto next question when time exceeds limit
  useEffect(() => {
    if (millisecondsLeft <= 0) {
      nextQuestion();
    }
  }, [millisecondsLeft]);

  useEffect(() => {
    if (currentQuestion?.duration) {
      setMillisecondsLeft(Number(currentQuestion?.duration));
    }
  }, [currentQuestion?.duration]);

  const timing = useMemo(() => {
    const minutes = Math.floor(
      millisecondsLeft / Number(currentQuestion?.duration)
    );
    const seconds = Math.floor(
      (millisecondsLeft % Number(currentQuestion?.duration)) / 1000
    );
    // console.log(minutes, seconds, millisecondsLeft)

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, [millisecondsLeft, currentQuestion]);

  function nextQuestion() {
    const index = quiz?.questions?.findIndex(
      (item) => item?.id === currentQuestion?.id
    );
    const nextQuestion = quiz?.questions?.find(
      (item) => item?.id === quiz?.questions[index + 1]?.id
    );
    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    }
    // update question time limit
    if (millisecondsLeft > 0) {
      const updatedQuiz: TQuiz<TRefinedQuestion[]> = {
        ...quiz,
        questions: quiz?.questions?.map((item) => {
          if (item?.id === currentQuestion?.id) {
            return {
              ...item,
              duration: String(millisecondsLeft),
            };
          }
          return item;
        }),
      };
      updateQuiz(updatedQuiz);
    }
  }

  function previousQuestion() {
    const index = quiz?.questions?.findIndex(
      (item) => item?.id === currentQuestion?.id
    );
    const nextQuestion = quiz?.questions?.find(
      (item) => item?.id === quiz?.questions[index - 1]?.id
    );

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
    }
    // update question time limit
    if (millisecondsLeft > 0) {
      const updatedQuiz: TQuiz<TRefinedQuestion[]> = {
        ...quiz,
        questions: quiz?.questions?.map((item) => {
          if (item?.id === currentQuestion?.id) {
            return {
              ...item,
              duration: String(millisecondsLeft),
            };
          }
          return item;
        }),
      };
      updateQuiz(updatedQuiz);
    }
  }

  // active index
  const activeQuestionIndex = useMemo(() => {
    const index = quiz?.questions?.findIndex(
      (item) => item?.id === currentQuestion?.id
    );

    return index;
  }, [currentQuestion]);

  const optionLetter = ["A", "B", "C", "D"];

  // console.log("answer", answer)
  async function selectOption(id: string) {
    if (!attendeeDetail?.attendeeId) {
      toast.error("Only attendee can answer the question");
      return;
    }
    if (currentQuestion) {
      const updatedOptions = currentQuestion?.options?.map((item) => {
        return {
          ...item,
          isCorrect: item?.isAnswer === item?.optionId,
        };
      });
      setCurrentQuestion({ ...currentQuestion, options: updatedOptions });

      // user score: (correct 1, wrong 0), dependent on time

      // checking if the correct answer is chosen
      const isCorrectAnswer = currentQuestion?.options?.some(
        (item) => item?.isAnswer === id
      );
      //  console.log(isCorrectAnswer, millisecondsLeft);
      const score = isCorrectAnswer ? 1 : 0;
      // calculate the user point
      const attendeePoints =
        ((score * millisecondsLeft) / Number(currentQuestion?.duration)) *
        Number(currentQuestion?.points);
      //console.log(maxPoints)

      const updatedQuiz: TQuiz<TRefinedQuestion[]> = {
        ...quiz,
        questions: quiz?.questions?.map((item) => {
          if (item?.id === currentQuestion?.id) {
            return {
              ...item,
              options: updatedOptions,
            };
          }
          return item;
        }),
      };
      updateQuiz(updatedQuiz);

      const payload: Partial<TAnswer> = {
        ...attendeeDetail,
        quizId: quiz?.id,
        questionId: currentQuestion?.id,
        attendeePoints,
        answerDuration: millisecondsLeft,
        quizAlias: quiz?.quizAlias,
        maxPoints: Number(currentQuestion?.points),
        maxDuration: Number(currentQuestion?.duration),
        selectedOptionId: { optionId: id },
        correctOptionId: {
          optionId:
            currentQuestion?.options?.find(({ isAnswer }) => isAnswer === id)
              ?.optionId || "",
        },
      };

      await createAnswer({ payload });
    }
  }

  return (
    <div
      className={cn(
        "w-full h-full bg-white relative  px-6 py-12 border-x  flex flex-col items-start justify-between gap-3 col-span-7",
        isLeftBox && isRightBox && (isIdPresent || isOrganizer) && "col-span-5",
        !isLeftBox && !isRightBox && "col-span-full",
        !isIdPresent && !isOrganizer && "col-span-full"
      )}
    >
      <Button
        onClick={toggleRightBox}
        className={cn("absolute right-2 top-2", isRightBox && "hidden")}
      >
        <Maximize2 size={20} />
      </Button>
      <Button
        onClick={toggleLeftBox}
        className={cn("absolute bottom-1 left-1", isLeftBox && "hidden")}
      >
        <Maximize2 size={20} />
      </Button>
      <div className="border-b border-gray-500 gap-3 pb-2 w-full flex items-end justify-between">
        <p className="italic w-full text-gray-500">{quiz?.coverTitle ?? ""}</p>
        <div className="flex  items-center font-medium text-xs text-basePrimary gap-x-1">
          <p>{timing}</p>
          <Time size={15} />
        </div>
      </div>

      <div className="flex items-center flex-col justify-center w-full gap-3">
        <p className="font-medium w-full">{currentQuestion?.question}</p>
        {currentQuestion?.questionImage && (
          <Image
            className="w-52 sm:w-72 rounded-md h-48 sm:h-52 object-cover"
            alt="quiz"
            src={currentQuestion?.questionImage}
            width={400}
            height={400}
          />
        )}
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentQuestion?.options.map((option, index) => (
          <Option
            key={index}
            option={option}
            isOrganizer={isOrganizer}
            isIdPresent={isIdPresent}
            selectOption={selectOption}
            optionIndex={optionLetter[index]}
          />
        ))}
      </div>

      <div className="w-full mt-3 flex items-end justify-between">
        <div className="flex items-center gap-x-2">
          <Button
            onClick={previousQuestion}
            className={cn(
              "text-basePrimary w-[95px] border border-basePrimary hover:text-gray-50 bg-white hover:bg-basePrimary gap-x-2 h-10 font-medium hidden",
              activeQuestionIndex > 0 && "flex"
            )}
          >
            <p>Previous</p>
          </Button>
          <Button
            onClick={nextQuestion}
            className={cn(
              "text-gray-50 w-[95px] bg-basePrimary gap-x-2 h-10 font-medium hidden",
              activeQuestionIndex < quiz?.questions?.length && "flex"
            )}
          >
            <p>Next</p>
          </Button>
        </div>
        <p className="text-xs sm:text-mobile text-gray-500">{`${
          activeQuestionIndex + 1
        }/${quiz?.questions?.length}`}</p>

        <p className="w-1 h-1"></p>
      </div>
    </div>
  );
}
