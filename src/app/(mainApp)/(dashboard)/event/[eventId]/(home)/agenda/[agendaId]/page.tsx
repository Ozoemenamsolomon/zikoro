import SingleAgenda from "@/components/agenda/SingleAgenda";
import { metaGenerator } from "../../../../meta";
import { Metadata } from "next";

export const generateMetadata = async ({ params }: { params: { eventId: string } }): Promise<Metadata> =>
	await metaGenerator({ params });
export default function Page({
  params: { agendaId, eventId },
}: {
  params: { agendaId: string; eventId: string; };
}) {
  return <SingleAgenda agendaId={agendaId} eventId={eventId} />;
}
