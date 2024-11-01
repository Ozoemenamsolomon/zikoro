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
      <div className="w-full px-4 mx-auto  max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10 ">{children}</div>
     </div>
   
  );
}
