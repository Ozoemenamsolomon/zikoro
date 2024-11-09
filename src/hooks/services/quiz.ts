"use client";
import { toast } from "@/components/ui/use-toast";
import {
  TQuiz,
  TAnswer,
  TQuestion,
  TConnectedUser,
  TLiveQuizParticipant,
} from "@/types";
import {
  postRequest,
  patchRequest,
  getRequest,
  deleteRequest,
} from "@/utils/api";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { saveCookie } from "..";

const supabase = createClientComponentClient();
export const useCreateQuiz = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const createQuiz = async ({
    payload,
  }: {
    payload: Partial<TQuiz<TQuestion[]>>;
  }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest<TQuiz<TQuestion[]>>({
        endpoint: "/quiz",
        payload,
      });

      toast({
        description: "Creation Attempt Successful",
      });
      return data;
    } catch (error: any) {
      //
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { createQuiz, isLoading };
};

export const useUpdateQuiz = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const updateQuiz = async ({
    payload,
  }: {
    payload: Partial<TQuiz<TQuestion[]>>;
  }) => {
    setLoading(true);

    try {
      const { data, status } = await patchRequest<TQuiz<TQuestion[]>>({
        endpoint: "/quiz",
        payload,
      });

      if (status !== 200) throw data;

      toast({
        description: " Update successful",
      });
      return data;
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateQuiz, isLoading };
};

export const useGetQuizzes = (eventId: string) => {
  const [quizzes, setQuizzes] = useState<TQuiz<TQuestion[]>[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  // console.log({date})
  const getQuizzes = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TQuiz<TQuestion[]>[]>({
      endpoint: `/quiz/${eventId}`,
    });

    setLoading(false);

    if (status !== 200) return;

    //
    return setQuizzes(data.data);
  };

  useEffect(() => {
    getQuizzes();
  }, [eventId]);

  return { quizzes, isLoading, getQuizzes };
};

export const useFetchQuiz = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const getQuiz = async (quizId: string) => {
    try {
      setLoading(true);
      const { data, status } = await getRequest<TQuiz<TQuestion[]>>({
        endpoint: `/quiz/single/${quizId}`,
      });

      if (status !== 200) {
        throw data;
      }
      return data.data;
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, getQuiz };
};

export const useGetQuiz = ({ quizId }: { quizId: string }) => {
  const [quiz, setQuiz] = useState<TQuiz<TQuestion[]> | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getQuiz = async () => {
    try {
      setLoading(true);
      const { data, status } = await getRequest<TQuiz<TQuestion[]>>({
        endpoint: `/quiz/single/${quizId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setQuiz(data.data);
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuiz();
  }, [quizId]);

  const fetchQuiz = (updatedQuiz: TQuiz<TQuestion[]>) => {
    setQuiz(updatedQuiz);
  };

  return { quiz, isLoading, getQuiz, setQuiz: fetchQuiz };
};

export const useDeleteQuiz = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const deleteQuiz = async ({ quizId }: { quizId: string }) => {
    setLoading(true);

    try {
      const { data, status } = await deleteRequest<TQuiz<TQuestion[]>>({
        endpoint: `/quiz/delete/${quizId}`,
      });

      if (status !== 201) throw data.data;
      toast({
        description: " Delete successful",
      });

      return data.data;
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { deleteQuiz, isLoading };
};

/*** Answer ***/
export const useCreateAnswer = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const createAnswer = async ({ payload }: { payload: Partial<TAnswer> }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest<TAnswer>({
        endpoint: "/quiz/answer",
        payload,
      });
      /**
       
      toast({
        description: "",
      });
       */
      return data;
    } catch (error: any) {
      //
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { createAnswer, isLoading };
};

export const useUpdateAnswer = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const updateAnswer = async ({ payload }: { payload: Partial<TAnswer> }) => {
    setLoading(true);

    try {
      const { data, status } = await patchRequest<TAnswer>({
        endpoint: "/quiz/answer",
        payload,
      });

      if (status !== 200) throw data;

      /**
       toast({
        description: "",
      });
      */
      return data;
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateAnswer, isLoading };
};

export const useGetAnswer = () => {
  const [answer, setAnswer] = useState<TAnswer[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  // console.log({date})
  const getAnswer = async (questionId: string) => {
    setLoading(true);

    const { data, status } = await getRequest<TAnswer[]>({
      endpoint: `/quiz/answer/single/${questionId}`,
    });

    setLoading(false);

    if (status !== 200) return;

    //
    return setAnswer(data.data);
  };

  /**
   useEffect(() => {
    getAnswer();
  }, [questionId]);
  */

  return { answer, isLoading, getAnswer };
};

export const useGetQuizAnswer = () => {
  const [answers, setAnswers] = useState<TAnswer[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  // console.log({date})
  const getAnswers = async (quizId: number) => {
    setLoading(true);

    const { data, status } = await getRequest<TAnswer[]>({
      endpoint: `/quiz/answer/${quizId}`,
    });

    setLoading(false);

    if (status !== 200) return;

    //
    return setAnswers(data.data);
  };

  return { answers, isLoading, getAnswers, setAnswers };
};

export function useRealtimeQuestionUpdate({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<TQuiz<TQuestion[]> | null>(null);
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
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    const cleanUp = subscribeToUpdate();

    return cleanUp;
  }, [supabase]);
}

export const useRealtimePresence = (isLive: boolean) => {
  useEffect(() => {
    if (isLive) {
      const channel = supabase.channel("live-quiz");

      channel
        .on("presence", { event: "sync" }, () => {
          const newState = channel.presenceState();
          // console.log("sync", newState);
          for (let id in newState) {
            //  console.log(newState[id][0])
          }
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          console.log("join", key, newPresences);
          saveCookie("player", {
            userId: newPresences[0]?.presence_ref,
            connectedAt: newPresences[0]?.online_at,
          });
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          // console.log("leave", key, leftPresences);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              online_at: new Date().toISOString(),
            });
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [supabase, isLive]);

  useEffect(() => {
    if (isLive) {
      const channel = supabase.channel("live-players");

      channel
        .on("presence", { event: "sync" }, () => {
          const newState = channel.presenceState();
          // console.log("sync", newState);
          for (let id in newState) {
            //  console.log(newState[id][0])
          }
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          // console.log("join", key, newPresences);
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          // console.log("leave", key, leftPresences);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              online_at: new Date().toISOString(),
            });
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [supabase, isLive]);

  useEffect(() => {
    if (isLive) {
      const channel = supabase.channel("live-answer");

      channel
        .on("presence", { event: "sync" }, () => {
          const newState = channel.presenceState();
          // console.log("sync", newState);
          for (let id in newState) {
            //  console.log(newState[id][0])
          }
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          // console.log("join", key, newPresences);
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          // console.log("leave", key, leftPresences);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              online_at: new Date().toISOString(),
            });
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [supabase, isLive]);
};

export function useBroadCastMessage() {
  async function sendBroadCast() {
    // Join a room/topic. Can be anything except for 'realtime'.
    const channelB = supabase.channel("live-quiz");

    channelB.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("status", status);
        channelB.send({
          type: "broadcast",
          event: "cursor-pos",
          payload: { x: Math.random(), y: Math.random() },
        });
      }
    });
  }

  return {
    sendBroadCast,
  };
}

export function useGetBroadCastMessage() {
  useEffect(() => {
    // Join a room/topic. Can be anything except for 'realtime'.

    // Simple function to log any messages we receive
    function messageReceived(payload: any) {
      // console.log("new message", payload);
    }

    // Subscribe to the Channel
    const channel = supabase.channel("live-quiz");
    // console.log("listen yeee", channel);

    channel.on("broadcast", { event: "cursor-pos" }, (payload) => {
      console.log("Cursor position received!", payload);
    });

    /**
 channel.subscribe((status) => {
  if (status === "SUBSCRIBED") {
    console.log("listen")
    channel.send({
      type: "broadcast",
      event: "cursor-pos",
      payload: { x: Math.random(), y: Math.random() },
    });
  }
});
 */

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
}

type TQuizScore = {
  quiz: Partial<TQuiz<TQuestion[]>>;
  mailto: {
    email: string;
    url: string;
    createQuiz: string;
    attendeePoint: number;
    leaderboard: string;
  };
};
export const useSendQuizScore = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const updateQuiz = async ({ payload }: { payload: TQuizScore }) => {
    setLoading(true);

    try {
      const { data, status } = await patchRequest<TQuizScore>({
        endpoint: "/quiz/score",
        payload,
      });

      if (status !== 200) throw data;

      toast({
        description: "Your score has been sent your mail.",
      });
      return data;
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateQuiz, isLoading };
};

export const useGetLiveParticipant = ({ quizId }: { quizId: string }) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [liveQuizPlayers, setLiveQuizPlayers] = useState<
    TLiveQuizParticipant[]
  >([]);

  const getLiveParticipant = async () => {
    try {
      setLoading(true);
      const { data, status } = await getRequest<TLiveQuizParticipant[]>({
        endpoint: `/quiz/participant/${quizId}`,
      });

      if (status !== 200) {
        throw data;
      }
      setLiveQuizPlayers(data.data);
    } catch (error: any) {
      //
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLiveParticipant();
  }, [quizId]);

  return { getLiveParticipant, liveQuizPlayers, isLoading, setLiveQuizPlayers };
};

export const useAddLiveParticipant = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const addLiveParticipant = async ({
    payload,
  }: {
    payload: Partial<TLiveQuizParticipant>;
  }) => {
    try {
      setLoading(true);
      const { data, status } = await postRequest<TLiveQuizParticipant>({
        endpoint: "/quiz/participant",
        payload,
      });

      toast({
        description: "Participant added successfully",
      });
      return data;
    } catch (error: any) {
      //
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { addLiveParticipant, isLoading };
};

export const useDeleteQuizLobby = (quizId: string) => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const deleteQuizLobby = async () => {
    try {
      setLoading(true);
      const { data, status } = await deleteRequest<TLiveQuizParticipant[]>({
        endpoint: `/quiz/participant/${quizId}`,
      });

      toast({
        description: "Participant deleted successfully",
      });
      return data;
    } catch (error: any) {
      //
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { deleteQuizLobby, isLoading };
};

export const useDeleteSingleParticipantFromLobby = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const deleteFromLobby = async (id: string) => {
    try {
      setLoading(true);
      const { data, status } = await deleteRequest<TLiveQuizParticipant[]>({
        endpoint: `/quiz/participant/single/${id}`,
      });

      // toast({
      //   description: "Participant deleted successfully",
      // });
      return data;
    } catch (error: any) {
      //
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { deleteFromLobby, isLoading };
};
