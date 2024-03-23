import Rewards from "@/components/marketPlace/rewards/Rewards";

export default function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  return <Rewards eventId={eventId} />;
}
