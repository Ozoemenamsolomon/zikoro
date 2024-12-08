import EventQaAttendeeView from "@/components/engagements/interactions/_components/interactionQa/attendee/EventQaAttendeeView";

export default function Page({
  params: { eventId, qaId },
}: {
  params: { qaId: string; eventId:string; };
}) {
  return <EventQaAttendeeView qaId={qaId} eventId={eventId} />;
}
