"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { TAnswer, TQuiz, TRefinedQuestion, TQuestion } from "@/types";
import { ScoreBoard } from "../ScoreBoard";
import lz from "lzutf8";
import { useGetQuizAnswer, useGetQuiz } from "@/hooks";
export default function ScoreBoardPage({ quizId }: { quizId: string }) {
  const { answers } = useGetQuizAnswer();
  const { quiz: actualQuiz } = useGetQuiz({ quizId });

  const params = useSearchParams();
  const router = useRouter();

  const quiz: TQuiz<TRefinedQuestion[]> | null = useMemo(() => {
    const quizString = params.get("quiz")!;
    const decodedQuiz = JSON.parse(decodeURIComponent(quizString));
    return quizString ? decodedQuiz : null;
  }, [params]);

  const quizAnswer: TAnswer[] = useMemo(() => {
    const quizAnswerString = params.get("quizAnswer")!;
    const decodedQuizAnswer = JSON.parse(decodeURIComponent(quizAnswerString));
    return quizAnswerString ? decodedQuizAnswer : [];
  }, [params]);

  const id = useMemo(() => params.get("id"), [params]);

  function goBack() {
    router.push("/interaction");
  }

  return (
    <ScoreBoard
      answers={answers}
      close={goBack}
      quiz={quiz}
      id={id as string}
      isAttendee={true}
      quizAnswer={quizAnswer}
      actualQuiz={actualQuiz}
    />
  );
}
