import Quiz from "@/components/interactions/quiz/Quiz";

export default function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  return <Quiz eventId={eventId} />;
}
