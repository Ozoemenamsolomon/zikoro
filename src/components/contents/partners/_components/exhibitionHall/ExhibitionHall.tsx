"use client";

import { Button } from "@/components";
import { cn } from "@/lib";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { useState } from "react";
import { AddExhibitionHall } from "..";

export function ExhibitionHall() {
    const [isOpen, setOpen] = useState(false)

    function onClose() {
        setOpen((prev) => !prev)
    }
  return (
   <>
    <div className="w-full lg:col-span-3 flex flex-col">
      <div className="flex p-3 border-b items-center justify-between w-full">
        <p className="font-medium">Exhibition Hall</p>

        <Button 
        onClick={onClose}
        className="px-1 h-fit w-fit">
          <PlusCircle size={24} />
        </Button>
      </div>
      <div className="rounded-lg w-full border">
        <div className="w-full grid gap-3 font-medium grid-cols-3 p-2 items-center bg-gray-200 rounded-t-lg">
          <p>Hall Name</p>
          <p>Capacity</p>
          <p>Filled Seat</p>
        </div>
        {[1, 2, 3].map((_, index) => (
          <ExhibitionHallWidget
            key={_}
            className={
              index === [1, 2, 3].length - 1 ? "border-b-0" : "border-b"
            }
          />
        ))}
      </div>
    </div>

    {isOpen && <AddExhibitionHall close={onClose}/>}
   </>
  );
}

function ExhibitionHallWidget({ className }: { className: string }) {
  return (
    <div
      className={cn(
        "grid text-mobile grid-cols-3 items-center gap-4 p-2",
        className
      )}
    >
      <p>Hailey Bee</p>
      <p>20,000</p>
      <p>10,000</p>
    </div>
  );
}
