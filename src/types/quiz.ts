
export interface TQuiz {
  id: number;
  created_at: string;
  lastUpdated_at: string;
  quizName: string;
  coverTitle: string;
  description: string;
  coverImage: string;
  branding: { poweredBy: boolean; eventName: boolean };
  questions: JSON;
  totalDuration: number;
  totalPoints: number;
  eventAlias:string;
  quizAlias:string;
  
}
