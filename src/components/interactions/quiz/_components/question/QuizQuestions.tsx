"use client";

import { Button } from "@/components";
import { InteractionLayout } from "../../../_components";
import { ArrowBackOutline } from "@styled-icons/evaicons-outline/ArrowBackOutline";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { PlayBtn } from "@styled-icons/bootstrap/PlayBtn";
import { Settings } from "@styled-icons/feather/Settings";
import Image from "next/image";
import { ActiveQuestion, QuestionCard, QuizSettings, AddQuestion } from "..";
import { useState, useEffect } from "react";
import { cn } from "@/lib";
import Link from "next/link";
import {useVerifyUserAccess, useCheckTeamMember} from "@/hooks"
import { useRouter } from "next/navigation";
import { TQuiz, TQuestion, TRefinedQuestion } from "@/types";
import { useGetQuiz } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";

export default function QuizQuestion({
  quizId,
  eventId,
}: {
  eventId: string;
  quizId: string;
}) {
  const { quiz, isLoading, getQuiz } = useGetQuiz({ quizId });
  const { isOrganizer, attendeeId, attendeeName } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const [openQuestionModal, setOpenQusetionModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] =
    useState<TRefinedQuestion | null>(null);
  const [refinedQuizArray, setRefinedQuizArray] = useState<TQuiz<
    TRefinedQuestion[]
  > | null>(null);
  const [height, setHeight] = useState<number>(0);
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);


  function onClose() {
    setOpen((prev) => !prev);
  }

  function onToggle() {
    setOpenQusetionModal((prev) => !prev);
  }

  function questionHeight(num: number) {
    setHeight(num);
  }

  function setActiveQuestion(question: TRefinedQuestion) {
    setCurrentQuestion(question);
  }

  function updateQuiz(quiz: TQuiz<TRefinedQuestion[]>) {
    setRefinedQuizArray(quiz)
  }

  useEffect(() => {
    if (quiz) {
      const refinedArray = {
        ...quiz,
        questions: quiz?.questions?.map((item) => {
          return {
            ...item,
            options: item?.options?.map((option) => {
              return {
                ...option,
                isCorrect: "default",
              };
            }),
          };
        }),
      };
      setRefinedQuizArray(refinedArray);
    }
  }, [quiz]);

  return (
    <InteractionLayout eventId={eventId}>
      {isLoading ? (
        <div className="w-full flex items-center justify-center h-[20rem]">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="w-full border-b p-4 flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              className="px-0 w-fit h-fit gap-x-2 text-sm"
            >
              <ArrowBackOutline size={18} />
              <p>Back</p>
            </Button>

            <input
              defaultValue={quiz?.coverTitle}
              placeholder="Quiz Title"
              className="outline-none border-0 p-2 text-gray-500"
            />
          {(isIdPresent || isOrganizer) ? 
          
          <div className="flex items-center gap-x-2">
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full hover:bg-gray-100 p-1"
          >
            <Settings size={22} />
          </button>
          <Button
            onClick={onToggle}
            className={cn(
              "text-gray-50 bg-basePrimary gap-x-2 h-10 font-medium flex"
            )}
          >
            <PlusCircle size={20} />
            <p>Question</p>
          </Button>
          <Link
            href={`/quiz/${eventId}/present/${quiz?.quizAlias}`}
            className="text-basePrimary px-0 w-fit h-fit  hover:text-black gap-x-2 font-medium flex"
          >
            <PlayBtn size={20} />
          </Link>
        </div>
          : <p className="w-1 h-1"></p>}
           
          </div>
          <div className="w-full grid grid-cols-1  lg:grid-cols-5 pb-20">
            {!refinedQuizArray?.questions ||
            (Array.isArray(refinedQuizArray?.questions) &&
              refinedQuizArray?.questions?.length === 0) ? (
              <div className="w-full h-[300px] flex items-center justify-center col-span-full">
                <EmptyState />
              </div>
            ) : (
              <>
                <div className="w-full p-3 sm:p-4 lg:col-span-2">
                  <ActiveQuestion
                    attendeeDetail={{attendeeId: String(attendeeId), attendeeName}}
                    setActiveQuestion={setActiveQuestion}
                    quiz={refinedQuizArray}
                    activeQuestion={currentQuestion}
                    updateQuiz={updateQuiz}
                    setHeight={questionHeight}
                    isIdPresent={isIdPresent}
                    isOrganizer={isOrganizer}
                  />
                </div>

                <div
                  style={{ maxHeight: height === 0 ? "initial" : height + 30 }}
                  className="w-full lg:col-span-3 border-l p-2  lg:overflow-y-auto space-y-3"
                >
                  {Array.isArray(refinedQuizArray?.questions) &&
                    refinedQuizArray?.questions.map((question, index) => (
                      <QuestionCard
                        refetch={getQuiz}
                        key={question?.id}
                        id={index}
                        quiz={refinedQuizArray}
                        setActiveQuestion={setActiveQuestion}
                        activeQuestion={currentQuestion}
                        question={question}
                      />
                    ))}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {openQuestionModal && (
        <AddQuestion refetch={getQuiz} close={onToggle} quiz={quiz} />
      )}
      {isOpen && quiz && (
        <QuizSettings
          refetch={getQuiz}
          eventAlias={quiz?.eventAlias}
          close={onClose}
          quiz={quiz}
        />
      )}
    </InteractionLayout>
  );
}

function EmptyState() {
  return (
    <div className="w-full flex flex-col gap-y-3 items-center justify-center h-[24rem]">
      <Image
        className="w-fit h-fit"
        src="/emptyquiz.png"
        alt="empty"
        width={250}
        height={350}
      />
      <p className="text-gray-500">No Quiz</p>
    </div>
  );
}
