"use client";
import { toast } from "@/components/ui/use-toast";
import { TQuiz, TAnswer, TQuestion, TConnectedUser } from "@/types";
import {
  postRequest,
  patchRequest,
  getRequest,
  deleteRequest,
} from "@/utils/api";
import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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
        description: "Quiz created successfully",
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
        description: "Quiz Updated successfully",
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

  return { quiz, isLoading, getQuiz };
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
        description: "Quiz deleted successfully",
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

  return { answers, isLoading, getAnswers };
};

export function useRealtimeQuestionUpdate({ quizId }: { quizId: string }) {
  useEffect(() => {
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
  }, [supabase]);
}

export const useRealtimePresence = () => {
  const [presentUser, setPresentUser] = useState<TConnectedUser>();
  useEffect(() => {
    const channel = supabase.channel("live-quiz");

    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState();
          console.log("sync", newState);
        for (let id in newState) {
          //  console.log(newState[id][0])
        }
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        // console.log("join", key, newPresences[0]);
        setPresentUser({
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
  }, [supabase]);

  return {
    presentUser,
  };
};

export function useBroadCastMessage() {
  async function sendBroadCast() {
    // Join a room/topic. Can be anything except for 'realtime'.
    const channelB = supabase.channel("live-quiz");

    channelB.subscribe((status) => {
      // Wait for successful connection
      if (status !== "SUBSCRIBED") {
        return null;
      }

      console.log("subscribed");

      // Send a message once the client is subscribed
      channelB.send({
        type: "broadcast",
        event: "test",
        payload: { message: "hello, world" },
      });
    });
  }

  return {
    sendBroadCast,
  };
}

export function useGetBroadCastMessage() {
  useEffect(() => {
    // Join a room/topic. Can be anything except for 'realtime'.
    const channelA = supabase.channel("live-quiz");

    // Simple function to log any messages we receive
    function messageReceived(payload: any) {
      console.log("new message", payload);
    }

    // Subscribe to the Channel
    channelA
      .on("broadcast", { event: "test" }, (payload) => messageReceived(payload))
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channelA.track({
            online_at: new Date().toISOString(),
          });
        }
      });
  }, [supabase]);
}
