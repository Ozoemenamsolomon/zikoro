import * as z from "zod";
import { quizQuestionSchema } from "@/schemas";
export interface TQuiz {
  id: number;
  created_at: string;
  lastUpdated_at: string;
  quizName: string;
  coverTitle: string;
  description: string;
  coverImage: string;
  branding: { poweredBy: boolean; eventName: boolean };
  questions: TQuestion[];
  totalDuration: number;
  totalPoints: number;
  eventAlias: string;
  quizAlias: string;
}

export type TQuestion = z.infer<typeof quizQuestionSchema> & {
  id: string;
};

export interface TAnswer {
  id: number;
  created_at: string;
  attendeeId: string;
  attendeeName: string;
  quizId: number;
  questionId: string;
  startTime: string;
  endTime: string;
  maxPoints: string;
  maxDuration: string;
  attendeePoints: string;
  answerDuration: string;
  quizAlias: string;
  selectedOptionId: { optionId: string };
  correctOptionId: { optionId: string };
}
