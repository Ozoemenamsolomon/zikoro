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
import { isAfter } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { Slider } from "@mui/material";
import {
  useGetQuiz,
  useUpdateQuiz,
  useGetAnswer,
  useGetQuizAnswer,
  useDeleteQuizLobby,
  useAddLiveParticipant,
  useGetLiveParticipant,
  useFetchSingleEvent,
} from "@/hooks";
import {
  TRefinedQuestion,
  TQuiz,
  TQuestion,
  TAttendee,
  TLiveQuizParticipant,
  TAnswer,
} from "@/types";
import {
  useCheckTeamMember,
  useVerifyUserAccess,
  useRealtimePresence,
} from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import Image from "next/image";
import { Button, Input } from "@/components";
import { generateAlias } from "@/utils";
import { cn } from "@/lib";
import toast from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Avatar, { genConfig, AvatarFullConfig } from "react-nice-avatar";
import { Plus } from "styled-icons/bootstrap";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { useRouter, useSearchParams } from "next/navigation";

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
  const { quiz, getQuiz, setQuiz } = useGetQuiz({ quizId }); // hooks for fetching the a single quiz
  const [isNotStarted, setIsNotStarted] = useState(true); // state to check whether the admin or attendee has started the quiz
  const { isOrganizer, attendeeId, attendee, loading, isLoading } =
    useVerifyUserAccess(eventId); // verify user
  const { isIdPresent } = useCheckTeamMember({ eventId }); // verify team member
  const [isRightBox, setRightBox] = useState(true); // state to toggle advert panel visibility
  const [isLeftBox, setLeftBox] = useState(true); // state to toggle leaderboard panel visibility
  const [isLobby, setisLobby] = useState(false); // state to show the attendee's or player's lobby
  const { answers, getAnswers, setAnswers } = useGetQuizAnswer(); // hook to fetch all quiz answers
  const [isSendMailModal, setIsSendMailModal] = useState(false); // state to toggle send-mail modal after attendee finishes the quiz
  const [showScoreSheet, setShowScoreSheet] = useState(false); // state to toggle show-score sheet after attendee finishes the quiz
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [volume, adjustVolume] = useState(0.05);
  const { data } = useFetchSingleEvent(eventId);
  const params = useSearchParams();
  const { liveQuizPlayers, setLiveQuizPlayers, getLiveParticipant } =
    useGetLiveParticipant({
      quizId: quizId,
    });
  const query = params.get("redirect");
  const aId = params.get("id");
  // const {liveQuizPlayers} = useGetLiveParticipant({quizId})
  const { deleteQuizLobby } = useDeleteQuizLobby(quizId);

  const [chosenAvatar, setChosenAvatar] =
    useState<Required<AvatarFullConfig> | null>(null);
  // quiz result stores the state for quiz that is currently being answered by the attendee (for attendees only)
  const [quizResult, setQuizResult] = useState<TQuiz<
    TRefinedQuestion[]
  > | null>(null);
  const { answer, getAnswer } = useGetAnswer(); // hook to fetch a single question answer
  const [playerDetail, setPlayerDetail] = useState<TPlayerDetail>({
    phone: "",
    email: "",
    nickName: attendee?.firstName || "",
  });
  // const player = getCookie<TConnectedUser>("player");

  const [refinedQuizArray, setRefinedQuizArray] = useState<TQuiz<
    TRefinedQuestion[]
  > | null>(null);
  // useRealtimeQuestionUpdate({quizId})

  // subscribe to quiz
  useEffect(() => {
    // function subscribeToUpdate() {
    if (!quiz?.accessibility?.live) return;
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
          setQuiz(payload.new as TQuiz<TQuestion[]>);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, quiz, isIdPresent, isOrganizer]);

  function createBeep() {
    if (typeof window !== "undefined") {
      const audio = new Audio("/audio/beep.wav");
      //  audio.src = "audio/AylexCinematic.mp3";

      audio.volume = 0.2;

      audio.play();
    }
  }
  // subscribe to player
  useEffect(() => {
    if (!quiz?.accessibility?.live) return;
    const channel = supabase
      .channel("live-players")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "quizLobby",
          filter: `quizAlias=eq.${quiz?.quizAlias}`,
        },
        (payload) => {
          // console.log("new", payload.new);
          setLiveQuizPlayers((prev) => [
            ...prev,
            payload.new as TLiveQuizParticipant,
          ]);
          createBeep();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, quiz]);
  // memoized audio instance
  const audio = useMemo(() => createAudioInstance(), []);

  // subscribe to answers
  useEffect(() => {
    if (!quiz?.accessibility?.live) return;
    const channel = supabase
      .channel("live-answer")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "quizAnswer",
          filter: `quizId=eq.${quiz?.id}`,
        },
        (payload) => {
          setAnswers((prev) => [...prev, payload.new as TAnswer]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, quiz]);

  // generate a unique id for player
  const id = useMemo(() => {
    //TODO if redirect, return;
    if (query) return aId!;
    return generateAlias();
  }, [query]);

  // toggle leaderboard
  function onClose() {
    setLeftBox((prev) => !prev);
  }

  // toggle advert panel
  function onToggle() {
    setRightBox((prev) => !prev);
  }

  // for updating current player quiz, but later restructured
  function updateQuiz(quiz: TQuiz<TRefinedQuestion[]>) {
    setRefinedQuizArray(quiz);
  }

  // also for updating current player quiz, and used to show the answer sheet
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

  // toggle
  function close() {
    setIsNotStarted(false);
  }

  // end quiz
  function exitQuiz() {
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

  // show score sheet after live quiz
  useEffect(() => {
    (async () => {
      if (quiz && quiz?.accessibility?.live) {
        if (quiz?.liveMode?.isEnded) {
          // saveCookie("currentPlayer", null);
          setShowScoreSheet(quiz?.liveMode?.isEnded);
          setIsSendMailModal(true);
          if (audio) audio.pause();
          //  if (liveQuizPlayers?.length > 0) {
          await deleteQuizLobby();
          //  }
        }
      }
    })();
  }, [quiz]);

  // change audio state
  function toggleAudio() {
    if (audio) {
      setIsAudioMuted(!audio.muted);
      audio.muted = !audio.muted;
    }
  }

  // audio volume change
  function handleVolume(num: number) {
    if (audio) {
      adjustVolume(num);
      audio.volume = num;
    }
  }

  return (
    <div className="w-full">
      {refinedQuizArray && !loading && !isLoading ? (
        <>
          {showScoreSheet ? (
            <>
              {isSendMailModal && !isOrganizer && !isIdPresent ? (
                <SendMailModal<TRefinedQuestion>
                  close={showSendMailModal}
                  id={id}
                  quiz={quizResult}
                  actualQuiz={quiz}
                  isAttendee={!isIdPresent && !isOrganizer}
                  answers={answers}
                  attendeeEmail={attendee?.email || playerDetail?.email}
                />
              ) : (
                <ScoreBoard
                  isAttendee={!isIdPresent && !isOrganizer}
                  answers={answers}
                  close={() => {
                    setShowScoreSheet(false);
                    setIsNotStarted(true);
                    if (audio) audio.pause();
                  }}
                  id={id}
                  quiz={quizResult}
                  actualQuiz={quiz}
                />
              )}
            </>
          ) : (
            <>
              {quiz?.accessibility?.live && (
                <div
                  className={cn(
                    "absolute top-[0.5rem] right-[10rem] hidden items-start gap-x-2",
                    (isOrganizer || isIdPresent) && "flex"
                  )}
                >
                  <Button
                    title={isAudioMuted ? "unmute" : "mute"}
                    onClick={toggleAudio}
                    className={cn("px-0 w-fit text-gray-500 h-fit ")}
                  >
                    {isAudioMuted ? (
                      <HiSpeakerXMark className="text-2xl" />
                    ) : (
                      <HiSpeakerWave className="text-2xl" />
                    )}
                  </Button>
                  <div className="w-[80px]">
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      size="small"
                      value={volume}
                      className="w-full h-1"
                      onChange={(_, e) => {
                        handleVolume(e as number);
                      }}
                      sx={{
                        color: "#6b7280",
                        height: 4,
                        padding: 0,
                        "& .MuiSlider-thumb": {
                          width: 8,
                          height: 8,
                          transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                          "&:before": {
                            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                          },
                          "&:hover, &.Mui-focusVisible": {
                            boxShadow: `0px 0px 0px 6px #6b7280`,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              )}
              {isNotStarted && quiz ? (
                <div className="w-full grid grid-cols-8 mt-[2.4rem] items-center h-full">
                  {(isIdPresent || isOrganizer) && isLobby && (
                    <Advert
                      quiz={quiz}
                      eventName={data?.eventTitle ?? ""}
                      isRightBox={isRightBox}
                      isLeftBox={isLeftBox}
                      close={onClose}
                    />
                  )}
                  <PlayersOnboarding
                    refetchLobby={getLiveParticipant}
                    attendee={attendee}
                    close={close}
                    isAttendee={!isIdPresent && !isOrganizer}
                    refetch={getQuiz}
                    quiz={quiz}
                    id={id}
                    attendeeId={attendeeId}
                    playerDetail={playerDetail}
                    setPlayerDetail={setPlayerDetail}
                    isLobby={isLobby}
                    setisLobby={setisLobby}
                    chosenAvatar={chosenAvatar}
                    setChosenAvatar={setChosenAvatar}
                    audio={audio}
                    onToggle={onToggle}
                    isLeftBox={isLeftBox}
                    liveQuizPlayers={liveQuizPlayers}
                  />
                </div>
              ) : (
                <div className="w-full mx-auto absolute px-4 sm:px-6  inset-x-0 top-10 grid md:grid-cols-11 h-[90vh] overflow-hidden items-start">
                  {(isIdPresent || isOrganizer) && quiz && (
                    <Advert
                      quiz={quiz}
                      eventName={data?.eventTitle ?? ""}
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
                    actualQuiz={quiz!}
                    getLiveParticipant={getLiveParticipant}
                    isRightBox={isRightBox}
                    toggleRightBox={onToggle}
                    toggleLeftBox={onClose}
                    onOpenScoreSheet={onOpenScoreSheet}
                    goBack={exitQuiz}
                    updateQuiz={updateQuiz}
                    updateQuizResult={updateQuizResult}
                    quizParticipantId={id}
                    liveQuizPlayers={liveQuizPlayers}
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

export function PlayersOnboarding({
  close,
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
  quiz,
  onToggle,
  isLeftBox,
  liveQuizPlayers,
  refetchLobby,
}: {
  close: () => void;
  attendee?: TAttendee;
  refetch: () => Promise<any>;
  isAttendee: boolean;
  id: string;
  playerDetail: TPlayerDetail;
  refetchLobby?: () => Promise<any>;
  setPlayerDetail: React.Dispatch<React.SetStateAction<TPlayerDetail>>;
  isLobby: boolean;
  setisLobby: React.Dispatch<React.SetStateAction<boolean>>;
  attendeeId?: number;
  chosenAvatar: Required<AvatarFullConfig> | null;
  setChosenAvatar: React.Dispatch<
    React.SetStateAction<Required<AvatarFullConfig> | null>
  >;
  audio?: HTMLAudioElement | null;
  quiz: TQuiz<TQuestion[]>;
  onToggle: () => void;
  isLeftBox: boolean;
  liveQuizPlayers: TLiveQuizParticipant[];
}) {
  const { updateQuiz } = useUpdateQuiz();
  const params = useSearchParams();
  const query = params.get("redirect");
  const respAlias = params.get("responseAlias");
  const { addLiveParticipant } = useAddLiveParticipant();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isAvatarModal, setAvatarModal] = useState(false);
  const { organization } = useOrganizationStore();
  useRealtimePresence(quiz?.accessibility?.live);
  const [isAvatar, setIsAvatar] = useState(false);

  const isMaxParticipant = useMemo(() => {
    if (
      !quiz?.accessibility?.live &&
      quiz?.quizParticipants?.length >= 15000 &&
      organization?.subscriptionPlan === "Enterprise"
    ) {
      return true;
    } else if (
      !quiz?.accessibility?.live &&
      quiz?.quizParticipants?.length >= 1000 &&
      organization?.subscriptionPlan === "Professional"
    ) {
      return true;
    } else if (
      !quiz?.accessibility?.live &&
      quiz?.quizParticipants?.length >= 200 &&
      organization?.subscriptionPlan === "Lite"
    ) {
      return true;
    } else {
      return false;
    }
  }, [quiz?.accessibility?.live, quiz, organization]);

  const isMaxLiveParticipant = useMemo(() => {
    if (
      quiz?.accessibility?.live &&
      liveQuizPlayers?.length >= 15000 &&
      organization?.subscriptionPlan === "Enterprise"
    ) {
      return true;
    } else if (
      quiz?.accessibility?.live &&
      liveQuizPlayers?.length >= 1000 &&
      organization?.subscriptionPlan === "Professional"
    ) {
      return true;
    } else if (
      quiz?.accessibility?.live &&
      liveQuizPlayers?.length >= 200 &&
      organization?.subscriptionPlan === "Lite"
    ) {
      return true;
    } else {
      return false;
    }
  }, [quiz?.accessibility?.live, quiz, liveQuizPlayers, organization]);

  useEffect(() => {
    if (quiz && isAttendee && !query) {
      if (quiz?.formAlias) {
        router.push(
          `/engagements/${quiz?.eventAlias}/form/${quiz?.formAlias}?redirect=quiz&id=${id}&link=${window.location.href}`
        );
      }
    }
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
  // player start quiz
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

    const isAttemptedQuiz = quiz?.quizParticipants?.some(
      (participant) => Number(participant.attendee?.id) === Number(attendeeId)
    );
    if (isAttendee && isAttemptedQuiz) {
      return toast.error("You have already attempted this quiz");
    }

    setLoading(true);
    if (quiz?.accessibility?.live) {
      const payload: TLiveQuizParticipant = {
        ...playerDetail,
        quizAlias: quiz?.quizAlias,
        quizParticipantId: id,
        attendee: attendee || undefined,
        joinedAt: new Date().toISOString(),
        participantImage: chosenAvatar,
        formResponseAlias: respAlias,
      };

      await addLiveParticipant({ payload });
    } else {
      const payload: Partial<TQuiz<TQuestion[]>> = {
        ...quiz,
        quizParticipants: quiz?.quizParticipants
          ? [
              ...quiz?.quizParticipants,
              {
                ...playerDetail,
                id: id,
                attendee: attendee || undefined,
                joinedAt: new Date().toISOString(),
                participantImage: chosenAvatar,
                formResponseAlias: respAlias,
              },
            ]
          : [
              {
                ...playerDetail,
                id: id,
                attendee: attendee || undefined,
                joinedAt: new Date().toISOString(),
                participantImage: chosenAvatar,
                formResponseAlias: respAlias,
              },
            ],
      };
      await updateQuiz({ payload });
    }

    //  saveCookie("currentPlayer", { id });

    await refetch();
    await refetchLobby?.();
    if (quiz?.accessibility?.live) {
      await refetchLobby?.();
      setisLobby(true);
    } else {
      close();
    }
    setLoading(false);
  }

  function onClose() {
    setisLobby(false);
    close();
  }

  // organizer start live quiz
  async function startLiveQuiz() {
    setLoading(true);
    const payload: Partial<TQuiz<TQuestion[]>> = {
      ...quiz,
      liveMode: { startingAt: new Date().toISOString() },
    };
    await updateQuiz({ payload });
    refetch();
    setisLobby(true);
    setLoading(false);
    if (audio) {
      audio.volume = 0.05;
      audio.play();
    }
  }

  useEffect(() => {
    if (!quiz?.liveMode?.startingAt) return;
    const currentTime = new Date();
    const quizStartingTime = new Date(quiz?.liveMode?.startingAt);
    let interval = setInterval(() => {
      if (isLobby && isAfter(currentTime, quizStartingTime)) {
        refetch();
      } else {
        clearInterval(interval);
      }
    }, 2000);
  }, []);

  // show the lobby if organizer has already started the quiz
  useEffect(() => {
    if (
      !isAttendee &&
      quiz?.accessibility?.live &&
      quiz?.liveMode?.startingAt
    ) {
      setisLobby(true);
      if (audio) {
        audio.volume = 0.05;
        audio.play();
      }
    }
  }, [isAttendee]);

  return (
    <>
      {isAttendee ? (
        <form
          onSubmit={submit}
          className={cn(
            "w-full text-sm p-4 gap-y-4 col-span-full flex flex-col h-fit absolute inset-0  justify-center items-center m-auto max-w-2xl rounded-lg bg-white",
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

          <div
            className={cn(
              "w-full flex justify-center items-end gap-x-2",
              (quiz.accessibility?.isCollectEmail ||
                quiz.accessibility?.isCollectEmail) &&
                "items-start"
            )}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
                placeholder="Enter Nickame"
                type="text"
              />
              {(quiz.accessibility?.isCollectEmail ||
                quiz.accessibility?.isCollectEmail) && (
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
                  type={quiz.accessibility?.isCollectEmail ? "email" : "tel"}
                />
              )}
              {quiz?.interactionType !== "poll" && (
                <>
                  {(quiz.accessibility?.isCollectEmail ||
                    quiz.accessibility?.isCollectEmail) && (
                    <div className="w-full  text-xs">
                      <p className="w-full text-gray-600 text-center">
                        {`${
                          quiz.accessibility?.isCollectEmail
                            ? "Email"
                            : "Phone Number"
                        } is required for this game to store your points and
                  possible follow-up should you appear on the leaderboard.`}
                      </p>
                    </div>
                  )}
                </>
              )}
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
            className="w-full h-[30vh] object-cover"
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
          <div className="w-full flex items-center justify-center flex-col gap-y-2">
            <Button
              onClick={() => {
                if (quiz?.accessibility?.live) {
                  startLiveQuiz();
                } else {
                  close();
                }
              }}
              disabled={isMaxParticipant || isMaxLiveParticipant}
              className={cn(
                "bg-basePrimary gap-x-2 px-10 h-12 rounded-lg text-gray-50 transform transition-all duration-400 ",
                isMaxParticipant && "bg-gray-400"
              )}
            >
              {loading && <LoaderAlt size={22} className="animate-spin" />}
              <p>
                {quiz?.interactionType !== "poll" ? "Start Quiz" : "Start Poll"}
              </p>
            </Button>
            {(isMaxParticipant || isMaxLiveParticipant) && (
              <p className="text-xs sm:text-mobile text-gray-600">
                Maximum limit has been reached.{" "}
              </p>
            )}
          </div>
        </div>
      )}

      {isLobby && (
        <QuizLobby
          goBack={() => setisLobby(false)}
          quiz={quiz}
          close={onClose}
          refetch={refetch}
          isAttendee={isAttendee}
          isMaxLiveParticipant={isMaxLiveParticipant}
          liveQuizPlayers={liveQuizPlayers}
          isLeftBox={isLeftBox}
          onToggle={onToggle}
          refetchLobby={refetchLobby}
          id={id}
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
