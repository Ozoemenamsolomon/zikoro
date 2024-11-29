import RequestAccess from "@/components/custom_ui/RequestAccess";

export default function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  return <RequestAccess eventId={eventId} />;
}
