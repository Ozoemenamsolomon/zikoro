import Presentation from "@/components/interactions/quiz/_components/presentation/Presentation";
export default function Page({
  params: { eventId, quizId },
}: {
  params: { eventId: string; quizId: string };
}) {
  return <Presentation eventId={eventId} quizId={quizId} />;
}
