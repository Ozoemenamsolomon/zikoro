"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { Button } from "..";
import { cn } from "@/lib";
import { useState } from "react";
import { Printer } from "@styled-icons/evaicons-solid/Printer";
import { ScanDash } from "@styled-icons/fluentui-system-regular/ScanDash";
import { Others, Custom, AddSession } from "./_components";
export default function Agenda({ eventId }: { eventId: string }) {
  const [activeDate, setActiveDate] = useState(0);
  const [isOpen, setOpen] = useState(false)
  const search = useSearchParams();
  const queryParam = search.get("a");

  const eventDateRange = [
    "20 Wed, November 2023",
    "21 Thur, November 2023",
    "22 Fri, November 2023",
  ];

  function onClose() {
    setOpen((prev) =>!prev)
  }

  return (
    <>
       <div>
      <div className="w-full overflow-x-auto no-scrollbar  p-4 text-base flex items-center gap-x-8 sm:justify-between text-[#3E404B] border-b border-basebody">
        <div className="flex items-center font-normal justify-center gap-x-8 text-sm">
          <Link
            href={`/event/${eventId}/agenda`}
            className={`pl-2 ${!queryParam && "text-basePrimary"}`}
          >
            Agenda
          </Link>
          <Link
            href={`/event/${eventId}/agenda?a=my-agenda`}
            className={`pl-2 ${
              queryParam?.includes("agenda") && "text-basePrimary"
            }`}
          >
            My Agenda
          </Link>
        </div>

        <Button
        onClick={onClose}
        className="  text-gray-50 bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium">
          <PlusCircle size={22} />
          <p>Session</p>
        </Button>
      </div>
      <div className="w-full no-scrollbar mt-8 overflow-x-auto">
        <div className="w-full flex items-center border-b px-4  gap-x-8">
          {eventDateRange.map((val, index) => (
            <button
              onClick={() => setActiveDate(index)}
              className={cn(
                "pb-3 text-gray-400  text-base sm:text-lg",
                activeDate === index && "border-basePrimary border-b-2 text-basePrimary"
              )}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
      <div className="w-full flex items-end p-4 justify-end gap-x-2">
        <Button className="px-0 w-fit h-fit ">
          <Printer size={20} />
        </Button>
        <Button className="px-0 w-fit h-fit ">
          <ScanDash size={20} />
        </Button>
      </div>

      <div className="w-full p-2 sm:p-4 grid grid-cols-1 items-center gap-6">
        <Others title="Registration" />
        <Others title="Launch" />
        <Custom />
        <Others title="Break" />
      </div>
    </div>
    {isOpen && <AddSession close={onClose} eventId={eventId} />}
    </>
 
  );
}
