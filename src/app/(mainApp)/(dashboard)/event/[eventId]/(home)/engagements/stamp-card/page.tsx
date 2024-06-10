import StampCard from "@/components/engagements/stampCard/StampCard";

export default function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  return <StampCard eventId={eventId} />;
}
