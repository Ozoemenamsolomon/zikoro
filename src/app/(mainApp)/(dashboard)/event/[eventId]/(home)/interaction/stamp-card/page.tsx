import StampCard from "@/components/interactions/stampCard/StampCard";

export default function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  return <StampCard eventId={eventId} />;
}
