import SingleAgenda from "@/components/agenda/SingleAgenda";

export default function Page({
  params: { agendaId, eventId },
}: {
  params: { agendaId: string; eventId: string; };
}) {
  return <SingleAgenda agendaId={agendaId} eventId={eventId} />;
}
