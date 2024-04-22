"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { Button } from "..";
import { cn } from "@/lib";
import { useState, useMemo } from "react";
import { Printer } from "@styled-icons/evaicons-solid/Printer";
import { ScanDash } from "@styled-icons/fluentui-system-regular/ScanDash";
import { Others, Custom, AddSession, FullScreenView } from "./_components";
import { useFetchSingleEvent } from "@/hooks";
import { generateDateRange } from "@/utils";
export default function Agenda({ eventId }: { eventId: string }) {
  const [activeDate, setActiveDate] = useState("");
  const [isOpen, setOpen] = useState(false);
  const { data } = useFetchSingleEvent(eventId);
  const [isFullScreen, setFullScreen] = useState(false);
  const search = useSearchParams();
  const queryParam = search.get("a");

  const dateRange = useMemo(() => {
    if (data) {
      const genDate = generateDateRange(data?.startDateTime, data?.endDateTime);
      setActiveDate(genDate[0]?.date);
      return genDate;
    } else {
      return [];
    }
  }, [data]);

  function onClose() {
    setOpen((prev) => !prev);
  }

  function toggleFullScreenMode() {
    setFullScreen((prev) => !prev);
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
            className={cn(" text-gray-50 bg-basePrimary hidden gap-x-2 h-11 sm:h-12 font-medium", activeDate && "flex")}
          >
            <PlusCircle size={22} />
            <p>Session</p>
          </Button>
        </div>
        <div className="w-full no-scrollbar mt-8 overflow-x-auto">
          <div className="min-w-max flex items-center border-b px-4  gap-x-8">
            {Array.isArray(dateRange) &&
              dateRange?.map((val, index) => (
                <button
                  key={val?.date}
                  onClick={() => setActiveDate(val?.date)}
                  className={cn(
                    "pb-3 text-gray-400  text-base sm:text-lg",
                    activeDate === val?.date &&
                      "border-basePrimary border-b-2 text-basePrimary"
                  )}
                >
                  {val?.formattedDate}
                </button>
              ))}
          </div>
        </div>
        <div className="w-full flex items-end p-4 justify-end gap-x-2">
          <Button className="px-0 w-fit h-fit ">
            <Printer size={20} />
          </Button>
          <Button onClick={toggleFullScreenMode} className="px-0 w-fit h-fit ">
            <ScanDash size={20} />
          </Button>
        </div>

        <div className="w-full p-2 sm:p-4 grid grid-cols-1 items-center gap-8">
          <Others
            data={{ timeStamp: "Today", session: [{ sessionTitle: "Registration" }] }}
          />
          <Others
            data={{ timeStamp: "Today", session: [{ sessionTitle: "Launch" }] }}
          />
          <Custom
            data={{
              timeStamp: "Today",
              session: [{ sessionTitle: "Introduction to Software Engineering" }],
            }}
          />
          <Others
            data={{ timeStamp: "Today", session: [{ sessionTitle: "Break" }] }}
          />
          <Custom
            data={{
              timeStamp: "Today",
              session: [
                { sessionTitle: "Introduction to Software Engineering" },
                { sessionTitle: "Basics of Mechatronics" },
              ],
            }}
          />
        </div>
      </div>
      {isOpen && <AddSession eventStartDate={activeDate} close={onClose} eventId={eventId} event={data}/>}
      {isFullScreen && <FullScreenView close={toggleFullScreenMode} />}
    </>
  );
}
