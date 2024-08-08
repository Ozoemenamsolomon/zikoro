import { PartnerDetails } from "@/components/partners/sponsors/PartnerDetail";

export default function Page({
  params: { partnerId, eventId },
}: {
  params: { partnerId: string; eventId: string };
}) {
  return <PartnerDetails partnerId={partnerId} eventId={eventId} />;
}
