"use client";

import { EditBox } from "@styled-icons/remix-line/EditBox";
import { cn } from "@/lib";
import { TAgenda } from "@/types";
import {formatTime, formatDate} from "@/utils";
import {useMemo} from "react"
import Link from "next/link"
export function SponsoredSessionWidget({
  sponsored,
  className
}: {
  sponsored: { session: TAgenda; sessionLink: string };
  className:string
}) {

  const agendaTime = useMemo(() => {
    if (sponsored?.session) {
      const start = formatTime(sponsored?.session?.startDateTime || "0");
      const end = formatTime(sponsored?.session?.endDateTime || "0");
      return `${start} - ${end}`;
    } else {
      return "";
    }
  }, [sponsored?.session?.startDateTime, sponsored?.session?.endDateTime]);

  
  const agendaDate = useMemo(() => {
    if (sponsored?.session) {
      return formatDate(sponsored?.session?.startDateTime);
    } else {
      return "";
    }
  }, [sponsored?.session?.startDateTime]);
  return (
    <div
      className={cn(
        "w-full flex sm:items-center text-mobile sm:text-sm flex-col sm:flex-row gap-4 items-start py-4 border-b justify-between",
        className
      )}
    >
      <div className="flex items-center gap-x-3">
        <p className="capitalize">{sponsored?.session?.sessionTitle}</p>
        <Link href={sponsored?.sessionLink} target="_blank" className="w-fit h-fit px-1">
          <EditBox size={22} />
        </Link>
      </div>
      <div className="flex flex-col items-start justify-start">
        <p>{agendaDate}</p>
        <p>{agendaTime}</p>
      </div>
    </div>
  );
}
