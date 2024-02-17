import { Offers } from "@/components/partners/_components";
import { MarketPlaceLayout } from "../_components";

export function PartnerOffers({eventId}:{eventId:string}) {
    return (
       <MarketPlaceLayout eventId={eventId}>
         <Offers className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"/>
       </MarketPlaceLayout>
    )
}