"use client"

import { cn } from "@/lib";
import { OfferCard } from "./OfferCard";
import { PromotionalOfferType, TAttendee } from "@/types";
import { useGetData } from "@/hooks/services/request";
import { EngagementsSettings } from "@/types/engagements";
import {  TLeadsInterest } from "@/types";
import { TLead } from "@/types";
export function Offers({
  className,
  data,
  attendee,
  isOrganizer,
  eventId,
  refetch
}: {
  className?: string;
  data: PromotionalOfferType[] | undefined;
  isOrganizer?: boolean;
  attendee?: TAttendee;
  eventId?:string;
  refetch: () => Promise<any>;
}) {

  const { data: engagementsSettings } = useGetData<EngagementsSettings>(
    `engagements/${eventId}/settings`
  );
  const { data: leadsInterests } = useGetData<TLeadsInterest[]>(
    `leads/interests/${eventId}`
  );
  const { data: leads } = useGetData<TLead[]>(`leads/event/${eventId}`);
  return (
    <div
      className={cn(
        "w-full grid px-3 grid-cols-1 mt-4 items-center gap-3",
        className
      )}
    >
      {Array.isArray(data) &&
        data?.map((item) => (
          <OfferCard
            key={item.partnerId}
            offer={item}
            attendee={attendee}
            isOrganizer={isOrganizer}
            engagementsSettings={engagementsSettings}
            leadsInterests={leadsInterests}
            leads={leads}
            refetch={refetch}
          />
        ))}
    </div>
  );
}
