 "use client"
import { MarketPlaceTab } from "..";

export function MarketPlaceLayout({
  eventId,
  eventName,
  children,
}: {
  children: React.ReactNode;
  eventId?: string;
  eventName?: string;
}) {

  return (
   
     <div className="w-full pb-24">
     <MarketPlaceTab eventId={eventId}/>
      <div className="w-full ">{children}</div>
     </div>
   
  );
}
