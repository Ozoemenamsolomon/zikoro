"use client";
import { toast } from "@/components/ui/use-toast";
import { TQuiz} from "@/types";
import {
  postRequest,
  patchRequest,
  getRequest,
  deleteRequest,
} from "@/utils/api";
import { useState, useEffect } from "react";

export const useCreateQuiz = () => {
  const [isLoading, setLoading] = useState<boolean>(false);

  const createQuiz = async ({ payload }: { payload: Partial<TQuiz> }) => {
    setLoading(true);

    try {
      const { data, status } = await postRequest({
        endpoint: "/quiz",
        payload,
      });

      if (status !== 201)
        return toast({
          description: (data.data as { error: string }).error,
          variant: "destructive",
        });

      toast({
        description: "Quiz created successfully",
      });
      return data;
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

  const updateQuiz = async ({ payload }: { payload: Partial<TQuiz> }) => {
    setLoading(true);

    try {
      const { data, status } = await patchRequest<TQuiz>({
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
  const [quizzes, setQuizzes] = useState<TQuiz[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  // console.log({date})
  const getQuizzes = async () => {
    setLoading(true);

    const { data, status } = await getRequest<TQuiz[]>({
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
  const [quiz, setQuiz] = useState<TQuiz | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const getQuiz = async () => {
    try {
      setLoading(true);
      const { data, status } = await getRequest<TQuiz>({
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
      const { data, status } = await deleteRequest<TQuiz>({
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
