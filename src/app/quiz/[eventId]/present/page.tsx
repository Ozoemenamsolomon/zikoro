import  JoinLIveQuiz  from "@/components/engagements/interactions/_components/presentation/attendee/JoinLiveQuiz";

export default function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  return <JoinLIveQuiz />;
}
