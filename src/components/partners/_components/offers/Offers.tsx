import { cn } from "@/lib";
import { OfferCard } from "./OfferCard";

export function Offers({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full grid px-3 grid-cols-1 mt-4 items-center gap-3",
        className
      )}
    >
      {[1, 2, 3, 4].map((_) => (
        <OfferCard key={_} />
      ))}
    </div>
  );
}
