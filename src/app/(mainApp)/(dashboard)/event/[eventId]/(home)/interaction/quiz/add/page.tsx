import QuizQuestion from "@/components/interactions/quiz/_components/question/QuizQuestions";
export default function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  return <QuizQuestion eventId={eventId} />;
}
