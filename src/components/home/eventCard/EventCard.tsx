"use client";

import { Button } from "@/components";
import { ThreeDotsVertical } from "styled-icons/bootstrap";
import { CalendarDateFill } from "@styled-icons/bootstrap/CalendarDateFill";
import { TimeFive } from "@styled-icons/boxicons-solid/TimeFive";
import { LocationDot } from "@styled-icons/fa-solid/LocationDot";
import { Users } from "@styled-icons/fa-solid/Users";
import { useState } from "react";

export function EventCard() {
  const [isAction, setAction] = useState(false);

  function onClose() {
    setAction((prev) => !prev);
  }
  return (
    <div className="border flex flex-col gap-y-6 rounded-lg p-3 sm:p-4 shadow-md w-full">
      <div className="w-full flex items-center justify-between">
        <p className="font-medium">BioMechanics of foot ulcer workshop</p>
        <div className="flex items-center gap-x-2">
          <p className="bg-zikoro/10 text-zikoro border border-zikoro rounded-md flex items-center justify-center w-fit px-2 h-10 text-xs">
            hybrid
          </p>
          <Button
            onClick={onClose}
            className="relative px-0 h-10 bg-transparent"
          >
            <ThreeDotsVertical size={20} />
            {isAction && <ActionModal close={onClose} />}
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col items-start justify-start">
        <AboutWidget
          Icon={CalendarDateFill}
          text="3rd March 2022 – 7th March 2022"
        />
        <AboutWidget Icon={TimeFive} text="8.00 a.m. - 5.00 p.m." />
        <AboutWidget Icon={LocationDot} text="Ikeja, LAGOS" />
        <AboutWidget Icon={Users} text="12 participants" />
      </div>

      <div className="flex items-center justify-between w-full">
        <p className="font-medium">₦100,000.00</p>

        <div className="flex text-xs text-gray-500 flex-col items-start justify-start">
          <p>Published</p>
          <p>12/02/23</p>
        </div>
      </div>
    </div>
  );
}

function AboutWidget({ Icon, text }: { Icon: any; text: string }) {
  return (
    <div className="flex items-center gap-x-2">
      <Icon className="text-gray-600" size={20} />
      <p>{text}</p>
    </div>
  );
}

function ActionModal({ close }: { close: () => void }) {
  return (
    <div className="absolute right-0 top-10  w-[120px]">
      <Button className="fixed inset-0 bg-none h-full w-full z-[100"></Button>
      <div
        role="button"
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex relative z-[120]  flex-col py-4 items-start justify-start bg-white rounded-lg w-full h-fit shadow-lg"
      >
        <Button
          onClick={close}
          className="items-center h-10 w-full text-red-600 hover:bg-gray-100 justify-start text-xs"
        >
          Delete
        </Button>
        <Button onClick={close} className="items-center h-10 hover:bg-gray-100 justify-start w-full  text-xs">
          Duplicate
        </Button>
      </div>
    </div>
  );
}
