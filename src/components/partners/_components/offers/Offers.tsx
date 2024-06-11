import { cn } from "@/lib";
import { OfferCard } from "./OfferCard";
import { PromotionalOfferType, TAttendee } from "@/types";

export function Offers({ className, data, attendee, isOrganizer }: { className?: string, data: PromotionalOfferType[] | undefined; isOrganizer: boolean;
  attendee?:TAttendee; }) {
  return (
    <div
      className={cn(
        "w-full grid px-3 grid-cols-1 mt-4 items-center gap-3",
        className
      )}
    >
      {Array.isArray(data) && data?.map((item) => (
        <OfferCard key={item.partnerId} offer={item} attendee={attendee} isOrganizer={isOrganizer} />
      ))}
    </div>
  );
}
