import QuizQuestion from "@/components/interactions/quiz/_components/question/QuizQuestions";
export default function Page({
  params: { eventId, quizId },
}: {
  params: { quizId: string; eventId:string; };
}) {
  return <QuizQuestion quizId={quizId} eventId={eventId} />;
}
