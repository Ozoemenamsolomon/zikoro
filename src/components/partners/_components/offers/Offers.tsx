import { cn } from "@/lib";
import { OfferCard } from "./OfferCard";
import { PromotionalOfferType } from "@/types";

export function Offers({ className, data }: { className?: string, data: PromotionalOfferType[] | undefined }) {
  return (
    <div
      className={cn(
        "w-full grid px-3 grid-cols-1 mt-4 items-center gap-3",
        className
      )}
    >
      {Array.isArray(data) && data?.map((item) => (
        <OfferCard key={item.partnerId} offer={item} />
      ))}
    </div>
  );
}
