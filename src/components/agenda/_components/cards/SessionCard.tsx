"use client";

import { cn } from "@/lib";
import { LiveView } from "@/constants";

export function SessionCard({
  children,
  isOther,
  isLive,

  className,
}: {
  isLive?: boolean;
  isOther?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full h-fit grid grid-cols-1 md:grid-cols-10 gap-4 relative md:gap-14 items-center px-4 py-10 rounded-xl border sm:px-6 sm:py-16",
        isOther && "py-8 sm:py-10",
        className
      )}
    >
      {isLive && (
        <p className="text-[11px] text-gray-50 bg-basePrimary absolute top-[0.1px] rounded-tl-xl left-0 p-2 ">
          Happening Now
        </p>
      )}
      {isLive && (
        <div className="flex items-center gap-x-2 mx-auto absolute inset-x-0 -top-6 px-4 w-fit justify-center h-12 rounded-lg text-[11px] sm:text-xs bg-basePrimary text-gray-50">
          <LiveView />
          <p>Live</p>
        </div>
      )}
      <div className="flex flex-col col-span-2 w-full pr-6 border-b-2 border-r-0 md:border-b-0 md:border-r-2 border-basePrimary items-start justify-start gap-y-1">
        <p className="font-semibold text-lg sm:text-3xl">9:00AM</p>
        <p className="font-normal text-sm sm:text-base">10:00AM</p>
      </div>
      {children}
    </div>
  );
}
