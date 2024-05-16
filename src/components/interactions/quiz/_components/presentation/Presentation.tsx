"use client";

import { Advert, LeaderBoard, Qusetion } from "..";
import { useState, useEffect } from "react";
import { useGetQuiz } from "@/hooks";
import { TRefinedQuestion, TQuiz } from "@/types";
import { useCheckTeamMember, useVerifyUserAccess } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
export default function Presentation({
  eventId,
  quizId,
}: {
  eventId: string;
  quizId: string;
}) {
  const { quiz, isLoading, getQuiz } = useGetQuiz({ quizId });
  const { isOrganizer, attendeeId, attendeeName } =
    useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const [isRightBox, setRightBox] = useState(true);
  const [isLeftBox, setLeftBox] = useState(true);
  const [refinedQuizArray, setRefinedQuizArray] = useState<TQuiz<
    TRefinedQuestion[]
  > | null>(null);

  function onClose() {
    setLeftBox((prev) => !prev);
  }

  function onToggle() {
    setRightBox((prev) => !prev);
  }

  function updateQuiz(quiz: TQuiz<TRefinedQuestion[]>) {
    setRefinedQuizArray(quiz);
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
    <div className="w-full">
      {refinedQuizArray ? (
        <div className="w-full grid md:grid-cols-11 h-full items-start">
        {(isIdPresent || isOrganizer) &&  <Advert
            quiz={refinedQuizArray}
            isRightBox={isRightBox}
            isLeftBox={isLeftBox}
            close={onClose}
          />}
          <Qusetion
            isLeftBox={isLeftBox}
            quiz={refinedQuizArray}
            isRightBox={isRightBox}
            toggleRightBox={onToggle}
            toggleLeftBox={onClose}
            updateQuiz={updateQuiz}
            attendeeDetail={{ attendeeId: String(attendeeId), attendeeName }}
            isIdPresent={isIdPresent}
            isOrganizer={isOrganizer}
          />
        {(isIdPresent || isOrganizer) &&   <LeaderBoard
            isRightBox={isRightBox}
            isLeftBox={isLeftBox}
            close={onToggle}
          />}
        </div>
      ) : (
        <div className="w-full h-[40vh] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      )}
    </div>
  );
}
