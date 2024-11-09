"use client";

import {
  TLiveQuizParticipant,
  TQuizParticipant,
  TQuiz,
  TQuestion,
} from "@/types";
import { InlineIcon } from "@iconify/react";
import Avatar from "react-nice-avatar";
import {
  useUpdateQuiz,
  useDeleteQuizLobby,
  useDeleteSingleParticipantFromLobby,
} from "@/hooks";
import { useMemo, useState } from "react";
import { isAfter } from "date-fns";

export function JoiningAttemptTab({
  liveQuizPlayers,
  close,
  quiz,
  refetch,
  refetchLobby,
  currentParticipants
}: {
  liveQuizPlayers: TLiveQuizParticipant[];
  quiz: TQuiz<TQuestion[]>;
  close: () => void;
  refetch: () => Promise<any>;
  refetchLobby: () => Promise<any>;
  currentParticipants: TQuizParticipant[];
}) {
  const [loading, setLoading] = useState(false);
  const { deleteFromLobby } = useDeleteSingleParticipantFromLobby();
  const { deleteQuizLobby } = useDeleteQuizLobby(quiz?.quizAlias);
  const { updateQuiz } = useUpdateQuiz();

  // new user
  // remove the user from the quizlobby
  // update the quiz table

  async function deny(id: string) {
    setLoading(true);
    await deleteFromLobby(id);
    refetch();
    refetchLobby();
    setLoading(false);
  }

  async function admit(id: string) {
    const player = liveQuizPlayers?.find((v) => v?.quizParticipantId === id);
    if (!player) return;
    setLoading(true);
    const { quizParticipantId, ...rest } = player;

    const payload: Partial<TQuiz<TQuestion[]>> = {
      ...quiz,
      //  liveMode: { startingAt, isStarting: true },
      quizParticipants:
        quiz?.quizParticipants && quiz?.quizParticipants?.length > 0
          ? [
              ...quiz?.quizParticipants,
              {
                ...rest,
                id: player?.quizParticipantId,
              },
            ]
          : [
              {
                ...rest,
                id: player?.quizParticipantId,
              },
            ],
    };
    await updateQuiz({ payload });
    await deleteFromLobby(id);
    refetch();
    refetchLobby();
    setLoading(false);
  }

  async function denyAll() {
    setLoading(true);
    await deleteQuizLobby();
    refetch();
    refetchLobby();
    setLoading(false);
  }

  async function admitAll() {
    setLoading(true);
    const mappedPlayers = liveQuizPlayers?.map((player) => {
      const { quizAlias, ...rest } = player;
      return {
        ...rest,
        id: player?.quizParticipantId,
      };
    });
    setLoading(true);
    const { startingAt } = quiz?.liveMode;
    const payload: Partial<TQuiz<TQuestion[]>> = {
      ...quiz,
      //  liveMode: { startingAt, isStarting: true },
      quizParticipants:
        quiz?.quizParticipants && quiz?.quizParticipants?.length > 0
          ? [...quiz?.quizParticipants, ...mappedPlayers]
          : [...mappedPlayers],
    };
    await updateQuiz({ payload });
    await deleteQuizLobby();
    refetch();
    refetchLobby();

    setLoading(false);
  }



  return (
    <div className="fixed inset-0 w-full z-[9999] min-h-screen ">
      <div className="w-[400px] h-full bg-white p-4">
        <div className="w-full border-b pb-4 flex items-center justify-between">
          <h2 className="font-medium">Participants</h2>
          <button onClick={close} className="">
            <InlineIcon icon="carbon:close-filled" fontSize={24} />
          </button>
        </div>
        {Array.isArray(liveQuizPlayers) && liveQuizPlayers?.length > 0 && (
          <div className="w-full mb-4 h-[40vh] bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-lg p-4">
            <div className="w-full flex mb-4 items-center justify-between">
              <div className="flex flex-col items-start justify-start">
                <p className="">Pending Participants</p>
                <p className="text-gray-500 text-xs sm:text-mobile">
                  Allow participants to join
                </p>
              </div>

              <p className="text-white bg-basePrimary w-10 h-10 text-2xl rounded-full items-center justify-center flex">
                {liveQuizPlayers?.length}
              </p>
            </div>
            <div className="w-full flex mb-3 items-center justify-center gap-x-6">
              <button
                disabled={loading}
                onClick={admitAll}
                className="font-medium text-basePrimary"
              >
                Admit All
              </button>
              <button
                disabled={loading}
                onClick={denyAll}
                className="font-medium text-red-600"
              >
                Deny All
              </button>
            </div>
            <div className="w-full overflow-y-auto no-scrollbar h-full">
              <div className="flex flex-col items-start justify-start gap-y-2">
                {Array.isArray(liveQuizPlayers) &&
                  liveQuizPlayers?.map((attendee) => (
                    <div
                      key={attendee.quizParticipantId}
                      className="bg-white w-full rounded-lg p-2 flex justify-between items-center gap-x-2"
                    >
                      <div className="flex items-center gap-x-2">
                        <Avatar
                          shape="rounded"
                          className="w-[2.5rem] h-[2.5rem]"
                          {...attendee?.participantImage}
                        />
                        <p>{attendee.nickName}</p>
                      </div>

                      <div className="flex items-center gap-x-2">
                        <button
                          disabled={loading}
                          onClick={() => admit(attendee.quizParticipantId)}
                          className="font-medium text-basePrimary"
                        >
                          Admit
                        </button>
                        <button
                          disabled={loading}
                          onClick={() => deny(attendee.quizParticipantId)}
                          className="font-medium text-red-600"
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
        <div className="w-full h-[50vh] bg-gradient-to-tr  from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-lg p-4">
          <div className="w-full flex mb-3 items-center justify-between">
            <p className="">Participants currently in the quiz</p>

            <p className="text-white bg-basePrimary w-10 h-10 text-2xl rounded-full items-center justify-center flex">
              {currentParticipants?.length}
            </p>
          </div>
          <div className="w-full overflow-y-auto no-scrollbar h-full">
            <div className="flex flex-col items-start justify-start gap-y-2">
              {Array.isArray(currentParticipants) &&
                currentParticipants?.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="bg-white rounded-lg p-2 w-full flex justify-start items-center gap-x-2"
                  >
                    <Avatar
                      shape="rounded"
                      className="w-[2.5rem] h-[2.5rem]"
                      {...attendee?.participantImage}
                    />
                    <p>{attendee.nickName}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
