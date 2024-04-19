import SingleAgenda from "@/components/agenda/SingleAgenda";

export default function Page({
  params: { agendaId },
}: {
  params: { agendaId: string };
}) {
  return <SingleAgenda agendaId={agendaId} />;
}
