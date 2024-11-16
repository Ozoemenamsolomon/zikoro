"use client";

import { cn } from "@/lib";
import { IconifyAgendaClockIcon, LiveView } from "@/constants";
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
        "w-full h-fit flex flex-col items-start gap-y-2 justify-start relative   p-4 rounded-xl border ",
        isReception && "md:grid-cols-1 lg:grid-cols-1  p-4",
        className
      )}
    >
     
       {isGreaterThanOne && (
        <p className="text-[8px] sm:text-[11px] text-gray-50 bg-basePrimary absolute top-[0.1px] rounded-tr-xl right-0 p-2 ">
          Multi Track
        </p>
      )}
      {/* {isLive && (
        <div className="flex items-center gap-x-2 mx-auto absolute inset-x-0 -top-6 px-4 w-fit justify-center h-12 rounded-lg text-[11px] sm:text-xs bg-basePrimary text-gray-50">
          <LiveView />
          <p>Live</p>
        </div>
      )} */}
      <div className="flex items-center gap-x-2">
        <IconifyAgendaClockIcon/>
        <p className=" ">
          {startTime} - {endTime}
        </p>
        {isLive && (
        <p className="text-[8px]  sm:text-[11px] text-red-500 border border-red-500 bg-red-200 rounded-lg px-2 py-1 ">
          Live
        </p>
      )}
      
     
      </div>
      {/* <div className={cn("flex flex-col md:col-span-2 pb-3 md:pb-0 w-fit md:w-full md:pr-6 border-b-2 border-r-0 md:border-b-0 md:border-r-2 border-basePrimary items-start justify-start gap-y-1",
       isReception && " md:col-span-full  md:pb-3 w-fit md:pr-0 md:border-b-2 md:border-r-0")}>
       
      </div> */}
      {children}
    </div>
  );
}

