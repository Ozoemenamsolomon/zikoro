"use client";

import { Advert, LeaderBoard, Qusetion, QuizLobby } from "..";
import { useState, useEffect, useMemo } from "react";
import {
  useGetQuiz,
  useUpdateQuiz,
  useGetAnswer,
  useGetQuizAnswer,
} from "@/hooks";
import { TRefinedQuestion, TQuiz, TQuestion, TAttendee } from "@/types";
import { useCheckTeamMember, useVerifyUserAccess } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import Image from "next/image";
import { Button, Input } from "@/components";
import { generateAlias } from "@/utils";
import { cn } from "@/lib";
import toast from "react-hot-toast";
export default function Presentation({
  eventId,
  quizId,
}: {
  eventId: string;
  quizId: string;
}) {
  const { quiz, getQuiz } = useGetQuiz({ quizId });
  const [nickName, setNickName] = useState("");
  const [isYetTosStart, setIsYetToStart] = useState(true);
  const { isOrganizer, attendeeId, attendee, loading, isLoading } =
    useVerifyUserAccess(eventId);
  const { isIdPresent, eventLoading } = useCheckTeamMember({ eventId });
  const [isRightBox, setRightBox] = useState(true);
  const [isLeftBox, setLeftBox] = useState(true);
  const [isLobby, setisLobby] = useState(false);
  const { answers, getAnswers } = useGetQuizAnswer();
  const { answer, getAnswer } = useGetAnswer();
  const [refinedQuizArray, setRefinedQuizArray] = useState<TQuiz<
    TRefinedQuestion[]
  > | null>(null);

  const id = generateAlias();
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

      getAnswers(quiz?.id);
    }
  }, [quiz]);

  function close() {
    setIsYetToStart(false);
  }

  // console.log({ isIdPresent, isOrganizer });

  return (
    <div className="w-full">
      {refinedQuizArray && !loading && !isLoading && !eventLoading ? (
        <>
          {isYetTosStart ? (
            <div className="w-full grid grid-cols-8 items-center h-full">
              {(isIdPresent || isOrganizer) && isLobby && (
                <Advert
                  quiz={refinedQuizArray}
                  isRightBox={isRightBox}
                  isLeftBox={isLeftBox}
                  close={onClose}
                />
              )}
              <AttendeeRegistration
                attendee={attendee}
                close={close}
                isAttendee={!isIdPresent && !isOrganizer}
                refetch={getQuiz}
                quiz={refinedQuizArray}
                id={id}
                nickName={nickName}
                setNickName={setNickName}
                isLobby={isLobby}
                setisLobby={setisLobby}
              />
            </div>
          ) : (
            <div className="w-full mx-auto absolute inset-x-0 top-10 grid md:grid-cols-11 h-[90vh] overflow-hidden items-start">
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
                answer={answer}
                getAnswer={getAnswer}
                refetchQuizAnswers={getAnswers}
                quiz={refinedQuizArray}
                isRightBox={isRightBox}
                toggleRightBox={onToggle}
                toggleLeftBox={onClose}
                updateQuiz={updateQuiz}
                quizParticipantId={id}
                attendeeDetail={{
                  attendeeId: attendeeId ? String(attendeeId) : null,
                  attendeeName: nickName,
                }}
                isIdPresent={isIdPresent}
                isOrganizer={isOrganizer}
              />
              {(isIdPresent || isOrganizer) && (
                <LeaderBoard
                  isRightBox={isRightBox}
                  isLeftBox={isLeftBox}
                  close={onToggle}
                  answers={answers}
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
  refetch,
  isAttendee,
  id,
  nickName,
  setNickName,
  isLobby,
  setisLobby,
}: {
  close: () => void;
  attendee?: TAttendee;
  quiz: TQuiz<TRefinedQuestion[]>;
  refetch: () => Promise<any>;
  isAttendee: boolean;
  id: string;
  nickName: string;
  setNickName: React.Dispatch<React.SetStateAction<string>>;
  isLobby: boolean;
  setisLobby: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { updateQuiz } = useUpdateQuiz();
  const [loading, setLoading] = useState(false);
  // const [isLobby, setisLobby] = useState(false);

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
    if (!nickName) {
      toast.error("Pls add a nickName");
      return;
    }

    setLoading(true);
    const payload: Partial<TQuiz<TQuestion[]>> = {
      ...actualQuiz,
      quizParticipants: actualQuiz?.quizParticipants
        ? [
            ...actualQuiz?.quizParticipants,
            { id, nickName, attendee: attendee || undefined },
          ]
        : [{ id, nickName, attendee: attendee || undefined }],
    };
    await updateQuiz({ payload });
    setLoading(false);
    refetch();
    close();
  }

  function onClose() {
    setisLobby(false);
    close();
  }
  return (
    <>
      {isAttendee ? (
        <div
          className={cn(
            "w-full text-sm p-4 gap-y-4 col-span-full flex flex-col items-center mx-auto max-w-2xl rounded-lg bg-white",
            isLobby && "hidden"
          )}
        >
          <Image
            src={quiz?.coverImage || "/quiztime.png"}
            alt="cover-image"
            className="w-full h-[250px] object-cover"
            width={2000}
            height={1000}
          />

          <div className="flex flex-col mb-4 items-center justify-center gap-y-3 w-full">
            <h2 className="font-semibold text-base sm:text-2xl">
              {quiz?.coverTitle ?? ""}
            </h2>
            <p>{`${quiz?.questions?.length || 0} ${
              quiz?.questions?.length > 1 ? "Questions" : "Question"
            }`}</p>
          </div>

          <Input
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            className="border-0 border-b rounded-none w-full max-w-[30em]"
            placeholder="Enter Nickname"
            type="text"
          />

          <Button
            disabled={loading}
            onClick={
              quiz?.accessibility?.live ? () => setisLobby(true) : submit
            }
            className="bg-basePrimary gap-x-2 px-10 h-12 rounded-lg text-gray-50 transform transition-all duration-400 "
          >
            {loading && <LoaderAlt size={22} className="animate-spin" />}
            <p> Let's Go</p>
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "w-full h-fit px-4 md:px-10 col-span-full lg:px-20 py-8 flex gap-y-6 sm:gap-y-10 flex-col items-center justify-center ",
            isLobby && "hidden"
          )}
        >
          <Image
            src={quiz?.coverImage || "/quiztime.png"}
            alt="cover-image"
            className="w-full h-[300px] object-cover"
            width={2000}
            height={1000}
          />
          <h2 className="font-semibold text-base sm:text-2xl">
            {quiz?.coverTitle ?? ""}
          </h2>

          <div className="w-full flex flex-col items-start justify-start gap-y-4">
            <h2 className="font-semibold">Description</h2>
            <p className="text-sm">{quiz?.description ?? ""}</p>
          </div>
          <Button
            onClick={() => setisLobby(true)}
            // onClick={quiz?.accessibility?.live ? () => setisLobby(true) : close}
            className="bg-basePrimary px-10 h-12 rounded-lg text-gray-50 transform transition-all duration-400 "
          >
            Start Quiz
          </Button>
        </div>
      )}

      {isLobby && (
        <QuizLobby
          goBack={() => setisLobby(false)}
          quiz={quiz}
          submit={submit}
          close={onClose}
          isAttendee={isAttendee}
        />
      )}
    </>
  );
}
