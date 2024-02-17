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
import { Eye } from "@styled-icons/evil/Eye";
import { CloseOutline } from "styled-icons/evaicons-outline";

type TExhibitonHall = {
  name: string;
  capacity: string;
  seat: number;
};

export function ExhibitionHall({
  eventId,
  partners,
  close
  
}: {
  partners: any[];
  eventId: string;
  close:() => void
}) {
  
  const { data, loading } = useFetchSingleEvent(eventId);



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
    <div className="w-full h-full inset-0 fixed z-[9999] bg-black/50">
      <div className="w-[95%] sm:w-[600px] absolute inset-0 m-auto h-fit min-h-[200px] max-h-[400px] rounded-md overflow-y-auto pb-8 bg-white">
        <div className="w-full  flex flex-col">
          <div className="flex p-3 border-b items-center justify-between w-full">
            <p className="font-medium">Exhibition Hall</p>

            <Button onClick={close} className="px-1 h-fit w-fit">
                <CloseOutline size={24} />
              </Button>
          
          </div>
          <div className="w-full p-3">
            <div className=" rounded-lg w-full border">
              <div className="w-full grid gap-3 font-medium text-sm grid-cols-3 px-2 py-4 items-center bg-gray-100 rounded-t-lg">
                <p>Hall Name</p>
                <p>Capacity</p>
                <p>Filled Booth</p>
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
      </div>
    </div>
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
