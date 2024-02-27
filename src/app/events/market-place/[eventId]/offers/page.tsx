import { PartnerOffers } from "../../../../../components/marketPlace/offers/PartnerOffers";
export default function Page({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  return (
   <PartnerOffers eventId={eventId}/>
  );
}
