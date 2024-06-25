"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import { TAnswer, TQuiz, TRefinedQuestion } from "@/types";
import { ScoreBoard } from "../ScoreBoard";
import lz from "lzutf8";
import { useGetQuizAnswer, useGetQuiz } from "@/hooks";
export default function ScoreBoardPage({ quizId }: { quizId: string }) {
  const { answers, getAnswers } = useGetQuizAnswer();
  const { quiz: actualQuiz } = useGetQuiz({ quizId });

  const params = useSearchParams();
  const router = useRouter();
  const id = useMemo(() => params.get("id"), [params]);

  useEffect(() => {
    (async () => {
      if (actualQuiz) {
        await getAnswers(actualQuiz?.id);
      }
    })();
  }, [actualQuiz]);

  const quiz: TQuiz<TRefinedQuestion[]> | null = useMemo(() => {
    if (actualQuiz) {
      const attemptedQuiz = actualQuiz?.quizParticipants?.find(
        (participant) => participant?.id === id
      )?.attemptedQuiz;

      return attemptedQuiz!;
    } else {
      return null;
    }
  }, [actualQuiz, id]);

  function goBack() {
    router.push(`/quiz/${actualQuiz?.eventAlias}/present/${quizId}`);
  }

  return (
    <>
      {answers && quiz && (
        <ScoreBoard
          answers={answers}
          close={goBack}
          quiz={quiz}
          id={id as string}
          isAttendee={true}
          actualQuiz={actualQuiz}
        />
      )}
    </>
  );
}
