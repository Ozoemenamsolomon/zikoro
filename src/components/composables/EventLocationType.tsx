import { cn } from "@/lib";

type EventLocationProp = {
  locationType: "Hybrid" | "Onsite" | "Online" | "Virtual" | string | undefined;
  className?: string;
};

export function EventLocationType({
  locationType,
  className,
}: EventLocationProp) {
  return (
    <p
      className={cn(
        "bg-basePrimary/10 text-basePrimary border border-basePrimary rounded-md flex items-center justify-center w-fit px-2 py-2  text-xs",
        className,
        locationType === "Onsite" &&
          "bg-[#3F845F]/10 text-[#3F845F] border-[#3F845F]",
          locationType === "Virtual" &&
          "bg-purple-600/10 text-purple-600 border-purple-600"

      )}
    >
      {locationType}
    </p>
  );
}
