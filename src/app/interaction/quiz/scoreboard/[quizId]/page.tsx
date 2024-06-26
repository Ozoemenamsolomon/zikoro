import ScoreBoardPage from "../../../../../components/engagements/interactions/_components/presentation/attendee/ScoreBoardPage";

export default function Page({
  params: { quizId },
}: {
  params: { quizId: string };
}) {
  return <ScoreBoardPage quizId={quizId} />;
}
