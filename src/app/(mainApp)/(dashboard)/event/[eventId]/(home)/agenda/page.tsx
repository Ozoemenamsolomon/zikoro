import Agenda from "@/components/agenda/Agenda";

export default function page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  return <Agenda eventId={eventId} />;
}
