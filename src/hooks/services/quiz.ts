"use client";
import { toast } from "@/components/ui/use-toast";
import { TQuiz, TAnswer, TQuestion } from "@/types";
import {
  postRequest,
  patchRequest,
  getRequest,
  deleteRequest,
} from "@/utils/api";
import { useState, useEffect } from "react";

export const useCreateQuiz = () => {
 
  const [isLoading, setLoading] = useState<boolean>(false);

  const createQuiz = async ({ payload }: { payload: Partial<TQuiz<TQuestion[]>> }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest<TQuiz<TQuestion[]>>({
        endpoint: "/quiz",
        payload,
      });

      toast({
        description: "Quiz created successfully",
      });
      return data
    } catch (error: any) {
      // console.log({ error });
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

  const updateQuiz = async ({ payload }: { payload: Partial<TQuiz<TQuestion[]>> }) => {
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
      return data
    } catch (error: any) {
      toast({
        description: error?.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { updateQuiz, isLoading};
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
      return data
    } catch (error: any) {
      // console.log({ error });
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
      return data
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
