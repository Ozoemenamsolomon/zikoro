"use client";

import { QUsers } from "@/constants";
import Image from "next/image";
import { Time } from "styled-icons/ionicons-outline";
import { FeedStar } from "styled-icons/octicons";
import { Button } from "@/components";
import { useGetAnswer} from "@/hooks";
import { useRef, useEffect, useMemo, useState } from "react";
import { TQuestion, TQuiz } from "@/types";
import { cn } from "@/lib";
import { OrganizerQuestOption } from "..";


export function ActiveQuestion({
  setHeight,
  activeQuestion,
  quiz,
  setActiveQuestion,

}: {
  setHeight: (n: number) => void;
  activeQuestion: TQuestion | null;
  quiz: TQuiz<TQuestion[]>;
  setActiveQuestion: (q: TQuestion) => void;

}) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const {answer, getAnswer} = useGetAnswer()
  const [millisecondsLeft, setMillisecondsLeft] = useState<number>(
    Number(activeQuestion?.duration)
  );

  useEffect(() => {
    function updateHeight() {
      if (divRef?.current && window.innerWidth >= 1024) {
        const rect = divRef?.current?.getBoundingClientRect();
        setHeight(rect.height);
        // 
      } else {
        setHeight(0);
      }
    }

    window.addEventListener("scroll", updateHeight);

    return () => {
      window.removeEventListener("scroll", updateHeight);
    };
  }, [window.innerWidth, divRef]);

  const points = useMemo(() => {
    // MAP AND SOME ALL POINTS
    const allPoints = quiz?.questions?.map(({ points }) => Number(points));
    const sumOfPoints = allPoints.reduce((sum, point) => sum + point, 0);
    return sumOfPoints || 0;
  }, [quiz]);

  const optionLetter = ["A", "B", "C", "D"];

  useEffect(() => {
    if (activeQuestion) {
      getAnswer(activeQuestion?.id)
    }

  },[activeQuestion])

 

  // goto next question when time exceeds limit
  useEffect(() => {
    if (millisecondsLeft <= 0) {
      nextQuestion();
    }
  }, [millisecondsLeft]);

  // next
  function nextQuestion() {
    const index = quiz?.questions?.findIndex(
      (item) => item?.id === activeQuestion?.id
    );
    const nextQuestion = quiz?.questions?.find(
      (item) => item?.id === quiz?.questions[index + 1]?.id
    );
    if (nextQuestion) {
      setActiveQuestion(nextQuestion);
    }
     
  }
  // prev
  function previousQuestion() {
    const index = quiz?.questions?.findIndex(
      (item) => item?.id === activeQuestion?.id
    );
    const nextQuestion = quiz?.questions?.find(
      (item) => item?.id === quiz?.questions[index - 1]?.id
    );

    if (nextQuestion) {
      setActiveQuestion(nextQuestion);
    }

  }

  // active index
  const activeQuestionIndex = useMemo(() => {
    const index = quiz?.questions?.findIndex(
      (item) => item?.id === activeQuestion?.id
    );

    return index;
  }, [activeQuestion]);

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

  const timing = useMemo(() => {
    const minutes = Math.floor(
      millisecondsLeft / Number(activeQuestion?.duration)
    );
    const seconds = Math.floor(
      (millisecondsLeft % Number(activeQuestion?.duration)) / 1000
    );

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }, [millisecondsLeft, activeQuestion]);

 

  useEffect(() => {
    if (activeQuestion?.duration) {
      setMillisecondsLeft(Number(activeQuestion?.duration));
    }
  }, [activeQuestion?.duration]);

  return (
    <div ref={divRef} className="w-full h-fit bg-gray-100 rounded-md py-4 px-3">
      {activeQuestion ? (
        <>
          <div className="text-gray-500 mb-3 text-xs ms:text-mobile flex items-center justify-between w-full">
            <p className="flex items-center gap-x-2">
              <span className="border-r pr-2 border-gray-500">
                {`${quiz?.questions?.length || 0} ${
                  quiz?.questions?.length > 1 ? "Questions" : "Question"
                }`}
              </span>
              <span>{`${points} points`}</span>
            </p>
            <p className="flex items-center gap-x-1">
              <QUsers />
              <span>{answer?.length ?? 0}</span>
            </p>
          </div>
          <div className="w-full text-mobile sm:text-sm py-3 bg-white rounded-md flex flex-col items-start justify-start gap-y-3">
            <div className="border-b text-gray-500 px-3 border-gray-600 gap-3 pb-2 w-full flex items-center justify-between">
              <div className="flex w-full items-center px-3 justify-between">
                <div className="flex bg-basePrimary/10 px-2 py-1 items-center font-medium text-xs text-basePrimary gap-x-1">
                  <p>{`${activeQuestion?.points ?? "0"}pts`}</p>
                  <FeedStar size={15} />
                </div>
                <div className="flex  items-center font-medium text-xs text-basePrimary gap-x-1">
                  <p>{timing ?? 0}</p>
                  <Time size={15} />
                </div>
              </div>
            </div>

            <div className="w-full px-3">
              {activeQuestion?.questionImage && (
                <Image
                  className="w-full rounded-md h-36 object-cover"
                  alt="quiz"
                  src={activeQuestion?.questionImage}
                  width={400}
                  height={400}
                />
              )}
            </div>
            <p className="font-medium w-full px-3">
            <div
            className="innerhtml"
            dangerouslySetInnerHTML={{
              __html: activeQuestion?.question ?? "",
            }}
          />
        
            </p>
            <div className="flex flex-col px-3 w-full items-start justify-start gap-y-2">
              {Array.isArray(activeQuestion?.options) &&
                activeQuestion?.options?.map((option, index) => (
                  <OrganizerQuestOption
                    key={index}
                    option={option?.option}
                    optionIndex={optionLetter[index]}
                  />
                ))}
            </div>

            <div className="w-full px-3 flex mt-3 items-end justify-between">
              <p className="text-xs sm:text-mobile text-gray-500">{`${
                activeQuestionIndex + 1
              }/${quiz?.questions?.length}`}</p>

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
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-[600px] flex items-center justify-center">
          <p className="font-medium text-sm">No Question Selected</p>
        </div>
      )}
    </div>
  );
}
