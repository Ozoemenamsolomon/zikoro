"use client";

import {
  useGetQuiz,
  useGetQuizAnswer,
  useVerifyUserAccess,
  useCheckTeamMember,
  useDeleteQuizLobby,
  useFetchSingleEvent,
  useGetAnswer,
} from "@/hooks";
import { useState, useEffect, useMemo } from "react";
import { AvatarFullConfig } from "react-nice-avatar";
import { TQuiz, TQuestion, TAnswer } from "@/types";
import { generateAlias } from "@/utils";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Advert } from "../presentation/Advert";
import { PlayersOnboarding } from "../presentation/Presentation";
import { PollQuestion } from "./_components/PollQuestion";
import { SendMailModal } from "../presentation/attendee/SendMailModal";
import { AnswerSheet } from "./_components/AnswerSheet";
type TPlayerDetail = {
  phone: string;
  email: string;
  nickName: string;
};

const supabase = createClientComponentClient();

export default function PollPresentation({
  eventId,
  quizId,
}: {
  eventId: string;
  quizId: string;
}) {
  const {
    quiz: poll,
    getQuiz: getPoll,
    setQuiz: setPoll,
  } = useGetQuiz({ quizId });
  const [isNotStarted, setIsNotStarted] = useState(true); // state to check whether the admin or attendee has started the quiz
  const { isOrganizer, attendeeId, attendee, loading, isLoading } =
    useVerifyUserAccess(eventId); // verify user
  const { data } = useFetchSingleEvent(eventId);
  const { isIdPresent, eventLoading } = useCheckTeamMember({ eventId }); // verify team member
  const [isLeftBox, setLeftBox] = useState(true); // state to toggle ad visibility
  const [isLobby, setisLobby] = useState(false); // state to show the attendee's or player's lobby
  const { answers, getAnswers, setAnswers } = useGetQuizAnswer(); // hook to fetch all poll answers
  const [isSendMailModal, setIsSendMailModal] = useState(false); // state to toggle send-mail modal after attendee finishes the quiz
  const [showScoreSheet, setShowScoreSheet] = useState(false); // state to toggle show-score sheet after attendee finishes the quiz
  const { deleteQuizLobby } = useDeleteQuizLobby(quizId);
  const { answer, getAnswer } = useGetAnswer(); // hook to fetch a single question answer
  const [chosenAvatar, setChosenAvatar] =
    useState<Required<AvatarFullConfig> | null>(null);
  // quiz result stores the state for quiz that is currently being answered by the attendee (for attendees only)
  const [pollResult, setPollResult] = useState<TQuiz<TQuestion[]> | null>(null);

  const [playerDetail, setPlayerDetail] = useState<TPlayerDetail>({
    phone: "",
    email: "",
    nickName: attendee?.firstName || "",
  });
  // const player = getCookie<TConnectedUser>("player");

  const [refinedPollArray, setRefinedPollArray] = useState<TQuiz<
    TQuestion[]
  > | null>(null);

  // subscribe to quiz
  useEffect(() => {
    // function subscribeToUpdate() {
    if (!poll?.accessibility?.live) return;
    const channel = supabase
      .channel("live-quiz")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "quiz",
          filter: `quizAlias=eq.${quizId}`,
        },
        (payload) => {
          setPoll(payload.new as TQuiz<TQuestion[]>);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, poll, isIdPresent, isOrganizer]);

  // subscribe to answers
  useEffect(() => {
    if (!poll?.accessibility?.live) return;
    const channel = supabase
      .channel("live-answer")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "quizAnswer",
          filter: `quizId=eq.${poll?.id}`,
        },
        (payload) => {
          setAnswers((prev) => [...prev, payload.new as TAnswer]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, poll]);

  // generate a unique id for player
  const id = useMemo(() => {
    return generateAlias();
  }, []);

  // toggle advert panel
  function onToggle() {
    setLeftBox((prev) => !prev);
  }

  useEffect(() => {
    if (poll) {
      getAnswers(poll?.id);
    }
  }, [poll]);

  // toggle
  function close() {
    setIsNotStarted(false);
  }

  function onClose() {
    setisLobby(false);
    close();
  }

  // end poll
  function exitPoll() {
    setIsNotStarted(true);
  }

  function onCloseScoreSheet() {
    setShowScoreSheet(false);
  }

  function onOpenScoreSheet() {
    setShowScoreSheet(true);
    setIsSendMailModal(true);
  }

  function showSendMailModal() {
    setIsSendMailModal(false);
    setShowScoreSheet(true);
  }
  console.log("ileft", isLeftBox);
  // show score sheet after live quiz
  useEffect(() => {
    (async () => {
      if (poll && poll?.accessibility?.live) {
        if (poll?.liveMode?.isEnded) {
          // saveCookie("currentPlayer", null);
          setShowScoreSheet(poll?.liveMode?.isEnded);
          setIsSendMailModal(true);

          //  if (liveQuizPlayers?.length > 0) {
          await deleteQuizLobby();
          //  }
        }
      }
    })();
  }, [poll]);

  // for updating current player quiz, but later restructured
  function updatePoll(quiz: TQuiz<TQuestion[]>) {
    setRefinedPollArray(quiz);
  }

  // also for updating current player quiz, and used to show the answer sheet
  function updatePollResult(quiz: TQuiz<TQuestion[]>) {
    setPollResult(quiz);
  }

  return (
    <div className="w-full">
      {poll && !loading && !isLoading && !eventLoading ? (
        <>
          {showScoreSheet ? (
            <>
              {isSendMailModal && !isOrganizer && !isIdPresent ? (
                <SendMailModal<TQuestion>
                  close={showSendMailModal}
                  id={id}
                  quiz={pollResult}
                  actualQuiz={poll}
                  isAttendee={!isIdPresent && !isOrganizer}
                  attendeeEmail={attendee?.email || playerDetail?.email}
                />
              ) : (
                <AnswerSheet
                  poll={pollResult} // change it to pull
                  answers={answers}
                  close={() => {
                    setShowScoreSheet(false);
                    setIsNotStarted(true);
                  }}
                />
              )}
            </>
          ) : (
            <>
              {isNotStarted && poll ? (
                <div className="w-full grid grid-cols-8 bg-white items-center h-full">
                  {(isIdPresent || isOrganizer) && isLobby && (
                    <Advert
                      quiz={poll}
                      eventName={data?.eventTitle ?? ""}
                      isRightBox={false}
                      isLeftBox={isLeftBox}
                      close={onClose}
                    />
                  )}
                  <PlayersOnboarding
                    attendee={attendee}
                    close={close}
                    isAttendee={!isIdPresent && !isOrganizer}
                    refetch={getPoll}
                    quiz={poll}
                    id={id}
                    attendeeId={attendeeId}
                    playerDetail={playerDetail}
                    setPlayerDetail={setPlayerDetail}
                    isLobby={isLobby}
                    setisLobby={setisLobby}
                    chosenAvatar={chosenAvatar}
                    setChosenAvatar={setChosenAvatar}
                  />
                </div>
              ) : (
                <div className="w-full mx-auto absolute px-4 sm:px-6 bg-white inset-x-0 top-10 grid md:grid-cols-11 h-[90vh] overflow-hidden items-start">
                  {(isIdPresent || isOrganizer) && poll && (
                    <Advert
                      quiz={poll}
                      eventName={data?.eventTitle ?? ""}
                      isRightBox={false}
                      isLeftBox={isLeftBox}
                      close={onClose}
                    />
                  )}
                  <PollQuestion
                    isLeftBox={isLeftBox}
                    answer={answer}
                    quizAnswer={answers}
                    getAnswer={getAnswer}
                    refetchQuiz={getPoll}
                    refetchQuizAnswers={getAnswers}
                    poll={poll || refinedPollArray}
                    toggleLeftBox={onClose}
                    onOpenScoreSheet={onOpenScoreSheet}
                    goBack={exitPoll}
                    updateQuiz={updatePoll}
                    updateQuizResult={updatePollResult}
                    pollParticipantId={id}
                    attendeeDetail={{
                      attendeeId: attendeeId ? String(attendeeId) : null,
                      attendeeName: playerDetail?.nickName,
                      email: playerDetail?.email,
                      phone: playerDetail?.phone,
                      avatar: chosenAvatar!,
                    }}
                    isIdPresent={isIdPresent}
                    isOrganizer={isOrganizer}
                  />
                </div>
              )}
            </>
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
