import EventPartnerTiers from "@/components/published/EventPartnerTiers";

export default function Page({searchParams, params: { id } }: {searchParams: any; params: { id: string } }) {
  return <EventPartnerTiers eventId={id} searchParams={searchParams} />;
}
