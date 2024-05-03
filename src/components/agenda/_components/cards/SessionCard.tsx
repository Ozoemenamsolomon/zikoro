"use client";

import { cn } from "@/lib";
import { LiveView } from "@/constants";
import { formatTime } from "@/utils";
import { useMemo } from "react";
import {isEventLive} from "@/utils"
export function SessionCard({
  children,
  timeStamp,
  className,
  isGreaterThanOne,
  isReception
}: {
  children: React.ReactNode;
  timeStamp: { start: string; end: string };
  className?: string;
  isGreaterThanOne?:boolean;
  isReception?:boolean
}) {
  const startTime = useMemo(() => {
    return formatTime(timeStamp?.start || "0");
  }, [timeStamp?.start]);
  const endTime = useMemo(() => {
    return formatTime(timeStamp?.end || "0");
  }, [timeStamp?.end]);

  const isLive = useMemo(() => {
      return isEventLive(timeStamp?.start, timeStamp?.end)
  },[timeStamp?.start, timeStamp?.end])

  return (
    <div
      className={cn(
        "w-full h-fit grid grid-cols-1 md:grid-cols-8 lg:grid-cols-10 gap-4 relative md:gap-14 items-center px-4 py-10 rounded-xl border sm:px-6 sm:py-14",
        isReception && "md:grid-cols-1 lg:grid-cols-1 md:gap-4 sm:px-4 sm:py-10",
        className
      )}
    >
      {isLive && (
        <p className="text-[8px]  sm:text-[11px] text-gray-50 bg-basePrimary absolute top-[0.1px] rounded-tl-xl left-0 p-2 ">
          Happening Now
        </p>
      )}
       {isGreaterThanOne && (
        <p className="text-[8px] sm:text-[11px] text-gray-50 bg-basePrimary absolute top-[0.1px] rounded-tr-xl right-0 p-2 ">
          Multi Track
        </p>
      )}
      {isLive && (
        <div className="flex items-center gap-x-2 mx-auto absolute inset-x-0 -top-6 px-4 w-fit justify-center h-12 rounded-lg text-[11px] sm:text-xs bg-basePrimary text-gray-50">
          <LiveView />
          <p>Live</p>
        </div>
      )}
      <div className={cn("flex flex-col md:col-span-2 pb-3 md:pb-0 w-fit md:w-full md:pr-6 border-b-2 border-r-0 md:border-b-0 md:border-r-2 border-basePrimary items-start justify-start gap-y-1",
       isReception && " md:col-span-full  md:pb-3 w-fit md:pr-0 md:border-b-2 md:border-r-0")}>
        <p className="font-semibold text-lg sm:text-[1.6rem]">{startTime}</p>
        <p className="font-normal text-sm sm:text-base">{endTime}</p>
      </div>
      {children}
    </div>
  );
}

