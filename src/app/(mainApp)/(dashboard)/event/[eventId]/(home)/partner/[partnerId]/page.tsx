import { PartnerDetails } from "@/components/partners/sponsors/PartnerDetail";

export default function Page({
  params: { partnerId, eventId },
  searchParams
}: {
  params: { partnerId: string; eventId: string };
  searchParams: any;
}) {
  return <PartnerDetails partnerId={partnerId} eventId={eventId} searchParams={searchParams} />;
}
