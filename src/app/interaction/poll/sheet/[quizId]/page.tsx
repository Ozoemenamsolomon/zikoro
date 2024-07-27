"use client"

import { useGetQuiz, useGetQuizAnswer } from "@/hooks";
import { useEffect } from "react";
import { AnswerSheet } from "@/components/engagements/interactions/_components/pollPresentation/_components/AnswerSheet";
export default function Page({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  const { quiz: poll } = useGetQuiz({ quizId });
  const { answers, getAnswers } = useGetQuizAnswer();

  useEffect(() => {
    if (poll) {
      getAnswers(poll?.id);
    }
  }, [quizId, poll]);

  return <AnswerSheet poll={poll} answers={answers} />;
}
