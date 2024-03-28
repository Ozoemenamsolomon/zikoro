import { cn } from "@/lib";

type FlexibilityProp = {
  flexibility: string;
  className?: string;
};

export function FlexibilityType({ flexibility, className }: FlexibilityProp) {
  return (
    <p
      className={cn(
        "text-xs px-2 py-2 rounded-md text-[#20A0D8] bg-[#20A0D8] bg-opacity-10 mt-3",
        className,
        flexibility === "Onsite" && "text-[#F44444] bg-[#F44444] bg-opacity-10",
        flexibility === "Hybrid" &&
          "text-purple-500 bg-purple-500 bg-opacity-10"
      )}
    >
      {flexibility}
    </p>
  );
}
