"use client";

import { Advert, LeaderBoard, Qusetion } from "..";
import { useState, useEffect, useMemo } from "react";
import { useGetQuiz, useUpdateQuiz } from "@/hooks";
import { TRefinedQuestion, TQuiz, TQuestion, TAttendee } from "@/types";
import { useCheckTeamMember, useVerifyUserAccess } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import Image from "next/image";
import { Button } from "@/components";
export default function Presentation({
  eventId,
  quizId,
}: {
  eventId: string;
  quizId: string;
}) {
  const { quiz, getQuiz } = useGetQuiz({ quizId });
  const [isAttendee, setIsAttendee] = useState(false);
  const { isOrganizer, attendeeId, attendee } = useVerifyUserAccess(eventId);
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
    if (!isIdPresent && !isOrganizer) {
      setIsAttendee(true);
    }
  }, [isIdPresent, isOrganizer]);

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

  function close() {
    setIsAttendee(false);
  }

  // isAnAttendee
  return (
    <div className="w-full">
      {refinedQuizArray ? (
        <>
          {isAttendee ? (
            <AttendeeRegistration
              attendee={attendee}
              close={close}
              refetch={getQuiz}
              quiz={refinedQuizArray}
            />
          ) : (
            <div className="w-full grid md:grid-cols-11 h-full items-start">
              {(isIdPresent || isOrganizer) && (
                <Advert
                  quiz={refinedQuizArray}
                  isRightBox={isRightBox}
                  isLeftBox={isLeftBox}
                  close={onClose}
                />
              )}
              <Qusetion
                isLeftBox={isLeftBox}
                quiz={refinedQuizArray}
                isRightBox={isRightBox}
                toggleRightBox={onToggle}
                toggleLeftBox={onClose}
                updateQuiz={updateQuiz}
                attendeeDetail={{
                  attendeeId: String(attendeeId),
                  attendeeName: `${attendee?.firstName} ${attendee?.lastName}`,
                }}
                isIdPresent={isIdPresent}
                isOrganizer={isOrganizer}
              />
              {(isIdPresent || isOrganizer) && (
                <LeaderBoard
                  isRightBox={isRightBox}
                  isLeftBox={isLeftBox}
                  close={onToggle}
                />
              )}
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-[40vh] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      )}
    </div>
  );
}

function AttendeeRegistration({
  close,
  quiz,
  attendee,
  refetch
}: {
  close: () => void;
  attendee?: TAttendee;
  quiz: TQuiz<TRefinedQuestion[]>;
  refetch:() => Promise<any>
}) {
  const { updateQuiz } = useUpdateQuiz();

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

  async function submit() {
    if (!attendee) return; 
    const payload: Partial<TQuiz<TQuestion[]>> = {
      ...actualQuiz,
      quizParticipants: actualQuiz?.quizParticipants ? [...actualQuiz?.quizParticipants, attendee] : [attendee]
    }
    await updateQuiz({payload})
    refetch()
    close();
  }
  return (
    <div
      style={{
        background: `radial-gradient(56.64% 56.64% at 49.91% 59.77%, rgba(19, 4, 32, 0.00) 0%, #140421 100%), url(${quiz?.coverImage})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="w-full h-full fixed flex items-center justify-center inset-0 "
    >
      <Button
        onClick={submit}
        className="bg-basePrimary px-10 h-12 rounded-lg text-gray-50 transform transition-all duration-400 "
      >
        Start Quiz
      </Button>
    </div>
  );
}

// <Image className="w-full h-full" src={quiz?.coverImage} width={2000} height={1000} alt="quizImage"/>
