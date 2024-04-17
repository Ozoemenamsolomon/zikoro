import { cn } from "@/lib";

export function SessionCard({children, isOther}:{isOther?:boolean; children: React.ReactNode}) {
  return (
    <div className={cn("w-full h-fit grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-14 items-center px-4 py-10 rounded-xl border sm:px-6 sm:py-16", isOther && "py-8 sm:py-10")}>
      <div className="flex flex-col col-span-2 w-full pr-6 border-b-2 border-r-0 md:border-b-0 md:border-r-2 border-basePrimary items-start justify-start gap-y-1">
        <p className="font-semibold text-lg sm:text-3xl">9:00AM</p>
        <p className="font-normal text-sm sm:text-base">10:00AM</p>
      </div>
    {children}
    </div>
  );
}
