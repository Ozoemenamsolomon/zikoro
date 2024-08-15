import CreatePartnerTiers from "@/components/contents/partners/CreatePartnerTiers";

export default function Page({
    params: { eventId },
  }: {
    params: { eventId: string };
  }) {
    return <CreatePartnerTiers eventId={eventId}/>
}