"use client";

import { Button } from "@/components";
import { cn } from "@/lib";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { useState } from "react";
import { AddExhibitionHall } from "..";
import { useMemo } from "react";
import { useFetchSingleEvent } from "@/hooks";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { EmptyCard } from "@/components/composables";

type TExhibitonHall = {
  name: string;
  capacity: string;
  seat: number;
};

export function ExhibitionHall({
  eventId,
  partners,
}: {
  partners: any[];
  eventId: string;
}) {
  const [isOpen, setOpen] = useState(false);
  const { data, loading, refetch } = useFetchSingleEvent(eventId);

  function onClose() {
    setOpen((prev) => !prev);
  }

  // format exhibition hall array
  const formatExhibitionHall: TExhibitonHall[] | undefined = useMemo(() => {
    if (data) {
      return data.exhibitionHall.map((item) => {
        let totalSeat = 0;
        partners.forEach((partner) => {
          if (partner.exhibitionHall === item.name) {
            totalSeat += Number(partner.boothNumber);
          }
        });
        return { ...item, seat: totalSeat };
      });

      // exhibitionHall;
    }
  }, [data, partners]);

  return (
    <>
      <div className="w-full lg:col-span-3 flex flex-col">
        <div className="flex p-3 border-b items-center justify-between w-full">
          <p className="font-medium">Exhibition Hall</p>

          <Button onClick={onClose} className="px-1 h-fit w-fit">
            <PlusCircle size={24} />
          </Button>
        </div>
        <div className="w-full p-3">
          <div className=" rounded-lg w-full border">
            <div className="w-full grid gap-3 font-medium text-sm grid-cols-3 px-2 py-4 items-center bg-gray-100 rounded-t-lg">
              <p>Hall Name</p>
              <p>Capacity</p>
              <p>Filled Seat</p>
            </div>
            {loading && (
              <div className="w-full col-span-full h-[300px] flex items-center justify-center">
                <LoaderAlt size={50} className="animate-spin" />
              </div>
            )}
            {!loading &&
              Array.isArray(formatExhibitionHall) &&
              formatExhibitionHall?.length === 0 && (
                <EmptyCard
                  width="70"
                  height="70"
                  text="No Exhibition Hall for this event"
                />
              )}

            {Array.isArray(formatExhibitionHall) &&
              formatExhibitionHall?.map((item, index) => (
                <ExhibitionHallWidget
                  key={`${item.name}${index}`}
                  className={
                    index === formatExhibitionHall?.length - 1
                      ? "border-b-0"
                      : "border-b"
                  }
                  name={item?.name}
                  capacity={item?.capacity}
                  seat={item?.seat}
                />
              ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <AddExhibitionHall
          eventId={eventId}
          refetch={refetch}
          close={onClose}
        />
      )}
    </>
  );
}

function ExhibitionHallWidget({
  className,
  name,
  capacity,
  seat,
}: {
  name: string;
  capacity: string;
  seat: number;
  className: string;
}) {
  return (
    <div
      className={cn(
        "grid text-sm grid-cols-3 items-center hover:bg-gray-50 gap-4 px-2 py-4",
        className
      )}
    >
      <p>{name}</p>
      <p>{Number(capacity)?.toLocaleString()}</p>
      <p>{seat?.toLocaleString()}</p>
    </div>
  );
}
