import { Jobs } from "@/components/marketPlace/jobs/Jobs";

export default function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {

  
  return <Jobs eventId={eventId} />;
}
