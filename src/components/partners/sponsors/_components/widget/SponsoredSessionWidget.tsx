"use client";

import { Button } from "@/components";
import { EditBox } from "@styled-icons/remix-line/EditBox";
import { cn } from "@/lib";

export function SponsoredSessionWidget({
  title,
  date,
  time,
  className,
}: {
  date: string;
  className: string;
  time: string;
  title: string;
}) {
  return (
    <div
      className={cn(
        "w-full flex items-center text-mobile sm:text-sm  py-4 border-b justify-between",
        className
      )}
    >
      <div className="flex items-center gap-x-3">
        <p className="capitalize">{title}</p>
        <Button className="w-fit h-fit px-1">
          <EditBox size={22} />
        </Button>
      </div>
      <div className="flex flex-col items-start justify-start">
        <p>{date}</p>
        <p>{time}</p>
      </div>
    </div>
  );
}
