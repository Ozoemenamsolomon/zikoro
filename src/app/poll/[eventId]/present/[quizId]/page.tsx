import PollPresentation from "@/components/engagements/interactions/_components/pollPresentation/PollPresentation";

export default function Page({
  params: { eventId, quizId },
}: {
  params: { eventId: string; quizId: string };
}) {
  return <PollPresentation eventId={eventId} quizId={quizId} />;
}
