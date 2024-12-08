import EventQaOrganizerView from "@/components/engagements/interactions/_components/interactionQa/organizer/EventQaOrganizerView";
export default function Page({
  params: { eventId, qaId },
}: {
  params: { qaId: string; eventId:string; };
}) {
  return <EventQaOrganizerView qaId={qaId} eventId={eventId} />;
}
