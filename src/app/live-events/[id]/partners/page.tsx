import EventPartnerTiers from "@/components/published/EventPartnerTiers";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return <EventPartnerTiers eventId={id} />;
}
