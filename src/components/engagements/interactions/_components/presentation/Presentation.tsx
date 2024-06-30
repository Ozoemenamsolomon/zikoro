"use client";

import {
  Advert,
  LeaderBoard,
  Qusetion,
  QuizLobby,
  ScoreBoard,
  SendMailModal,
  AvatarModal,
} from "..";
import { useState, useEffect, useMemo } from "react";
import {
  useGetQuiz,
  useUpdateQuiz,
  useGetAnswer,
  useGetQuizAnswer,
} from "@/hooks";
import {
  TRefinedQuestion,
  TQuiz,
  TQuestion,
  TAttendee,
  TConnectedUser,
} from "@/types";
import {
  useCheckTeamMember,
  useVerifyUserAccess,
  useRealtimePresence,
  getCookie,
} from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import Image from "next/image";
import { Button, Input } from "@/components";
import { generateAlias } from "@/utils";
import { cn } from "@/lib";
import toast from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Avatar, { genConfig, AvatarFullConfig } from "react-nice-avatar";
import { Plus } from "@styled-icons/bootstrap/Plus";

const supabase = createClientComponentClient();

// audio instance
function createAudioInstance() {
  if (typeof window !== "undefined") {
    const audio = new Audio("/audio/AylexCinematic.mp3");
    //  audio.src = "audio/AylexCinematic.mp3";
    audio.loop = true;

    return audio;
  }
  return null;
}

type TPlayerDetail = {
  phone: string;
  email: string;
  nickName: string;
};

export default function Presentation({
  eventId,
  quizId,
}: {
  eventId: string;
  quizId: string;
}) {
  const { quiz, getQuiz, setQuiz } = useGetQuiz({ quizId });

  const [isYetTosStart, setIsYetToStart] = useState(true);
  const { isOrganizer, attendeeId, attendee, loading, isLoading } =
    useVerifyUserAccess(eventId);
  const { isIdPresent, eventLoading } = useCheckTeamMember({ eventId });
  const [isRightBox, setRightBox] = useState(true);
  const [isLeftBox, setLeftBox] = useState(true);
  const [isLobby, setisLobby] = useState(false);
  const { answers, getAnswers } = useGetQuizAnswer();
  const [isSendMailModal, setIsSendMailModal] = useState(false);
  const [showScoreSheet, setShowScoreSheet] = useState(false);
  const [chosenAvatar, setChosenAvatar] =
    useState<Required<AvatarFullConfig> | null>(null);
  const [quizResult, setQuizResult] = useState<TQuiz<
    TRefinedQuestion[]
  > | null>(null);
  const { answer, getAnswer } = useGetAnswer();
  // const [nickName, setNickName] = useState(attendee?.firstName || "");
  const [playerDetail, setPlayerDetail] = useState<TPlayerDetail>({
    phone: "",
    email: "",
    nickName: attendee?.firstName || "",
  });
  const player = getCookie<TConnectedUser>("player");
  const audio = createAudioInstance();
  const [refinedQuizArray, setRefinedQuizArray] = useState<TQuiz<
    TRefinedQuestion[]
  > | null>(null);
  // useRealtimeQuestionUpdate({quizId})

  // subscribe to quiz
  useEffect(() => {
    function subscribeToUpdate() {
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
            console.log(payload);
            setQuiz(payload.new as TQuiz<TQuestion[]>);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    const cleanUp = subscribeToUpdate();

    return cleanUp;
  }, [supabase, quiz]);

  /**
   // subscribe to answers
  useEffect(() => {
    function subscribeToUpdate() {
      const channel = supabase
        .channel("live-quiz")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "quizAnswer",
            filter: `quizId=eq.${quiz?.id}`,
          },
          (payload) => {
            console.log(payload);
            setAnswers(payload.new as TAnswer[]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    const cleanUp = subscribeToUpdate();

    return cleanUp;
  }, [supabase, answers]);
 */

  const id = useMemo(() => {
    if (player) {
      return player?.userId;
    } else {
      return generateAlias();
    }
  }, []);
  function onClose() {
    setLeftBox((prev) => !prev);
  }

  function onToggle() {
    setRightBox((prev) => !prev);
  }

  function updateQuiz(quiz: TQuiz<TRefinedQuestion[]>) {
    setRefinedQuizArray(quiz);
  }

  function updateQuizResult(quiz: TQuiz<TRefinedQuestion[]>) {
    setQuizResult(quiz);
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

  function exitQuiz() {
    setIsYetToStart(true);
  }

  function onCloseScoreSheet() {
    setShowScoreSheet(false);
  }
  function onOpenScoreSheet() {
    setShowScoreSheet(true);
    setIsSendMailModal(true);
  }

  function showSendMailModal() {
    setIsSendMailModal((prev) => !prev);
  }
  // show score sheet after live quiz
  useEffect(() => {
    if (quiz && quiz?.accessibility?.live) {
      if (quiz?.liveMode?.isEnded) {
        setShowScoreSheet(quiz?.liveMode?.isEnded);
        setIsSendMailModal(true);
        if (audio) audio.pause();
      }
    }
  }, [quiz]);

  return (
    <div className="w-full">
      {refinedQuizArray && !loading && !isLoading && !eventLoading ? (
        <>
          {showScoreSheet ? (
            <>
              {isSendMailModal && !isOrganizer && !isIdPresent ? (
                <SendMailModal
                  close={showSendMailModal}
                  id={id}
                  quiz={quizResult}
                  actualQuiz={quiz}
                  isAttendee={!isIdPresent && !isOrganizer}
                  attendeeEmail={attendee?.email || playerDetail?.email}
                />
              ) : (
                <ScoreBoard
                  isAttendee={!isIdPresent && !isOrganizer}
                  answers={answers}
                  close={() => {
                    setShowScoreSheet(false);
                    setIsYetToStart(true);
                  }}
                  id={id}
                  quiz={quizResult}
                  actualQuiz={quiz}
                />
              )}
            </>
          ) : (
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
                  <PlayersOnboarding
                    attendee={attendee}
                    close={close}
                    isAttendee={!isIdPresent && !isOrganizer}
                    refetch={getQuiz}
                    quiz={refinedQuizArray}
                    id={id}
                    attendeeId={attendeeId}
                    playerDetail={playerDetail}
                    setPlayerDetail={setPlayerDetail}
                    isLobby={isLobby}
                    setisLobby={setisLobby}
                    chosenAvatar={chosenAvatar}
                    setChosenAvatar={setChosenAvatar}
                    audio={audio}
                  />
                </div>
              ) : (
                <div className="w-full mx-auto absolute px-4 sm:px-6  inset-x-0 top-10 grid md:grid-cols-11 h-[90vh] overflow-hidden items-start">
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
                    quizAnswer={answers}
                    getAnswer={getAnswer}
                    refetchQuiz={getQuiz}
                    refetchQuizAnswers={getAnswers}
                    quiz={refinedQuizArray}
                    isRightBox={isRightBox}
                    toggleRightBox={onToggle}
                    toggleLeftBox={onClose}
                    onOpenScoreSheet={onOpenScoreSheet}
                    goBack={exitQuiz}
                    updateQuiz={updateQuiz}
                    updateQuizResult={updateQuizResult}
                    quizParticipantId={id}
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
                  {(isIdPresent || isOrganizer) && quiz && (
                    <LeaderBoard
                      isRightBox={isRightBox}
                      isLeftBox={isLeftBox}
                      close={onToggle}
                      quiz={quiz}
                      answers={answers}
                    />
                  )}
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

function PlayersOnboarding({
  close,
  quiz,
  attendee,
  refetch,
  isAttendee,
  id,
  playerDetail,
  setPlayerDetail,
  isLobby,
  setisLobby,
  attendeeId,
  chosenAvatar,
  setChosenAvatar,
  audio,
}: {
  close: () => void;
  attendee?: TAttendee;
  quiz: TQuiz<TRefinedQuestion[]>;
  refetch: () => Promise<any>;
  isAttendee: boolean;
  id: string;
  playerDetail: TPlayerDetail;
  setPlayerDetail: React.Dispatch<React.SetStateAction<TPlayerDetail>>;
  isLobby: boolean;
  setisLobby: React.Dispatch<React.SetStateAction<boolean>>;
  attendeeId?: number;
  chosenAvatar: Required<AvatarFullConfig> | null;
  setChosenAvatar: React.Dispatch<
    React.SetStateAction<Required<AvatarFullConfig> | null>
  >;
  audio: HTMLAudioElement | null;
}) {
  const { updateQuiz } = useUpdateQuiz();

  const [loading, setLoading] = useState(false);
  const [isAvatarModal, setAvatarModal] = useState(false);
  useRealtimePresence();
  const player = getCookie<TConnectedUser>("player");
  const [isAvatar, setIsAvatar] = useState(false);
  //console.log("present", presentUser)
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

  function generateAvatars() {
    const avatars = Array.from({ length: 10 }).map((_, index) => {
      return {
        avatar: genConfig(),
      };
    });

    return avatars;
  }
  function toggleIsAvatar() {
    setIsAvatar((prev) => !prev);
  }

  const avatars = useMemo(() => {
    return generateAvatars();
  }, [isAvatar]);

  function toggleAvatarModal() {
    setAvatarModal((prev) => !prev);
  }
  async function submit(e: any) {
    e.preventDefault();
    if (!playerDetail?.nickName) {
      toast.error("Pls add a nickName");
      return;
    }
    if (chosenAvatar === null) {
      toast.error("Pls select an avatar");
      return;
    }

    if (!quiz?.accessibility?.visible && !attendeeId) {
      toast.error("You are not a registered attendee for this event");
      return;
    }

    const isAttemptedQuiz = actualQuiz?.quizParticipants?.some(
      (participant) => Number(participant.attendee?.id) === Number(attendeeId)
    );
    if (isAttendee && isAttemptedQuiz) {
      return toast.error("You have already attempted this quiz");
    }

    setLoading(true);
    const payload: Partial<TQuiz<TQuestion[]>> = {
      ...actualQuiz,
      quizParticipants: actualQuiz?.quizParticipants
        ? [
            ...actualQuiz?.quizParticipants,
            {
              ...playerDetail,
              id: player?.userId || id,
              attendee: attendee || undefined,
              joinedAt: player?.connectedAt || new Date().toISOString(),
              participantImage: chosenAvatar,
            },
          ]
        : [
            {
              ...playerDetail,
              id: quiz?.accessibility?.live ? player?.userId || "" : id,
              attendee: attendee || undefined,
              joinedAt: player?.connectedAt || new Date().toISOString(),
              participantImage: chosenAvatar,
            },
          ],
    };
    await updateQuiz({ payload });
    setLoading(false);
    refetch();
    if (quiz?.accessibility?.live) {
      setisLobby(true);
    } else {
      close();
    }
  }

  function onClose() {
    setisLobby(false);
    close();
  }
  async function startLiveQuiz() {
    setLoading(true);
    const payload: Partial<TQuiz<TQuestion[]>> = {
      ...actualQuiz,
      liveMode: { startingAt: new Date().toISOString() },
    };
    await updateQuiz({ payload });
    refetch();
    setisLobby(true);
    setLoading(false);
    // if (audio)  audio.play();
  }

  useEffect(() => {
    let interval = setInterval(() => {
      if (!isAttendee && quiz?.liveMode?.startingAt) {
        refetch();
      } else {
        clearInterval(interval);
      }
    }, 2000);
  }, []);

  return (
    <>
      {isAttendee ? (
        <form
          onSubmit={submit}
          className={cn(
            "w-full text-sm p-4 gap-y-4 col-span-full flex flex-col items-center mx-auto max-w-2xl rounded-lg bg-white",
            isLobby && "hidden"
          )}
        >
          <Image
            src={quiz?.coverImage || "/quiztime.png"}
            alt="cover-image"
            className="w-full h-[200px] object-cover"
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

          <div className="w-full flex justify-center items-start gap-x-2">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleAvatarModal();
              }}
              className="text-white rounded-full h-20 w-20 flex items-center justify-center bg-black/50 flex-col"
            >
              {chosenAvatar ? (
                <Avatar className="h-20 w-20 rounded-full" {...chosenAvatar} />
              ) : (
                <>
                  <Plus size={24} />
                  <p className="text-xs font-medium">Avatar</p>
                </>
              )}
            </button>
            <div className="w-[70%] max-w-[26em] space-y-2">
              <Input
                value={playerDetail?.nickName}
                onChange={(e) => {
                  setPlayerDetail({
                    ...playerDetail,
                    nickName: e.target.value,
                  });
                }}
                className="border-0 border-b rounded-none w-full"
                placeholder="Enter Name"
                type="text"
              />
              <Input
                value={
                  quiz.accessibility?.isCollectEmail
                    ? playerDetail?.email
                    : playerDetail?.phone
                }
                onChange={(e) => {
                  setPlayerDetail({
                    ...playerDetail,
                    [quiz.accessibility?.isCollectEmail ? "email" : "phone"]:
                      e.target.value,
                  });
                }}
                className="border-0 border-b rounded-none w-full"
                placeholder={
                  quiz.accessibility?.isCollectEmail
                    ? "Enter Email Address"
                    : "Enter Phone Number"
                }
                required
                type={quiz.accessibility?.isCollectEmail ? "email" : "tel"}
              />
              <div className="w-full  text-xs">
                <p className="w-full text-gray-600 text-center">
                  {`${quiz.accessibility?.isCollectEmail ? "Email": "Phone Number"} is required for this game to store your points and
                  possible follow-up should you appear on the leaderboard.`}
                </p>
              </div>
            </div>
          </div>

          <Button
            disabled={loading}
            // onClick={submit}
            className="bg-basePrimary gap-x-2 px-10 h-12 rounded-lg text-gray-50 transform transition-all duration-400 "
          >
            {loading && <LoaderAlt size={22} className="animate-spin" />}
            <p> Let's Go</p>
          </Button>
        </form>
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

          {quiz?.description && (
            <div className="w-full flex flex-col items-start justify-start gap-y-4">
              <h2 className="font-semibold">Description</h2>
              <p className="text-sm">{quiz?.description ?? ""}</p>
            </div>
          )}
          <Button
            onClick={() => {
              if (quiz?.accessibility?.live) {
                startLiveQuiz();
              } else {
                close();
              }
            }}
            className="bg-basePrimary gap-x-2 px-10 h-12 rounded-lg text-gray-50 transform transition-all duration-400 "
          >
            {loading && <LoaderAlt size={22} className="animate-spin" />}
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
          refetch={refetch}
          isAttendee={isAttendee}
        />
      )}
      {isAvatarModal && (
        <AvatarModal
          close={toggleAvatarModal}
          chosenAvatar={chosenAvatar}
          setChosenAvatar={setChosenAvatar}
          toggleIsAvatar={toggleIsAvatar}
          avatars={avatars}
        />
      )}
    </>
  );
}
