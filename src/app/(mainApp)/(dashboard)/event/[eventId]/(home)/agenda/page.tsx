import Agenda from "@/components/agenda/Agenda";

export default function page({
  params: { eventId },
  searchParams
}: {
  params: { eventId: string };
  searchParams: any
}) {
  return <Agenda eventId={eventId} searchParams={searchParams} />;
}
