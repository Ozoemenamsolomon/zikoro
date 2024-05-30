import * as z from "zod";
import { quizQuestionSchema } from "@/schemas";
import { TAttendee } from ".";
export interface TQuiz<T> {
  id: number;
  created_at: string;
  lastUpdated_at: string;
  quizName: string;
  coverTitle: string;
  liveMode: any;
  description: string;
  coverImage: string;
  branding: { poweredBy: boolean; eventName: boolean };
  questions: T;
  totalDuration: number;
  totalPoints: number;
  eventAlias: string;
  quizAlias: string;
  quizParticipants: { id: string; nickName: string; attendee?: TAttendee; joinedAt: string }[];
  accessibility: {
    visible: boolean;
    review: boolean;
    countdown: boolean;
    timer: boolean;
    countdownTransition: boolean;
    disable: boolean;
    live: boolean;
  };
}

export type TQuestion = z.infer<typeof quizQuestionSchema> & {
  id: string;
};

export type TRefinedQuestion = {
  id: string;
  question: string;
  questionImage?: any;
  duration: string;
  points: string;
  feedBack?: any;
  options: {
    optionId: string;
    option: string;
    isAnswer: string;
    isCorrect: boolean | string;
  }[];
};

export interface TAnswer {
  id: number;
  created_at: string;
  attendeeId: string | null;
  attendeeName: string;
  quizId: number;
  quizParticipantId:string;
  questionId: string;
  startTime: string;
  endTime: string;
  maxPoints: number;
  maxDuration: number;
  attendeePoints: number;
  answerDuration: number;
  quizAlias: string;
  selectedOptionId: { optionId: string };
  correctOptionId: { optionId: string };
}

export interface TConnectedUser {
  connectedAt: string;
  userId: string;
}