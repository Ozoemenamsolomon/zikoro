import { ContentPartners } from "@/components/contents/partners/ContentPartners";

export default function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  return <ContentPartners eventId={eventId} />;
}
