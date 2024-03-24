 "use client"

import { SideBarLayout } from "@/components";
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
   
     <div className="w-full">
     <MarketPlaceTab eventId={eventId}/>
      <div className="w-full ">{children}</div>
     </div>
   
  );
}
