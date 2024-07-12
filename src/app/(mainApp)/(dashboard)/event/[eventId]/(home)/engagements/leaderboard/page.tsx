import LeaderBoard from "@/components/engagements/leaderBoard/LeaderBoard";

export default function Page({
    params: { eventId },
  }: {
    params: { eventId: string };
  }) {
    return <LeaderBoard eventId={eventId}/>
}