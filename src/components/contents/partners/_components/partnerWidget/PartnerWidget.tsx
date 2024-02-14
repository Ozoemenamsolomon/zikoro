"use client";

import { sendMail, phoneCall, whatsapp } from "@/utils";
import { ArrowIosDownward } from "@styled-icons/evaicons-solid/ArrowIosDownward";
import { EmailOutline } from "@styled-icons/evaicons-outline/EmailOutline";
import { Whatsapp } from "@styled-icons/boxicons-logos/Whatsapp";
import { Call } from "styled-icons/material";
import { cn } from "@/lib";
import { useState, useMemo } from "react";
import { DropDownSelect } from "@/components/contents/_components";
import { Event } from "@/types";
import { useUpdateHall, useUpdateBooth } from "@/hooks";

export function PartnerWidget({
  item,
  event,
  className,
  refetch
}: {
  className: string;
  item: any;
  refetch:() => Promise<any>;
  event: Event | null;
}) {
  const [isHall, showHalls] = useState(false);
  const [isBooth, showBooths] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState("");
  const [selectedHall, setSelectedHall] = useState("");
  const { updateHall } = useUpdateHall();
  const { updateBooth } = useUpdateBooth();

  // format hall list
  const hallList = useMemo(() => {
    if (event) {
      return event.exhibitionHall.map(({ name }) => name);
    }
  }, [event]);

  // format booth list
  const boothList = useMemo(() => {
    if (event) {
      return Array.from({ length: 500 }, (_, index) => index + 1);
    }
  }, [event]);

  function toggleBooths() {
    showBooths((prev) => !prev);
  }
  function toggleHalls() {
    showHalls((prev) => !prev);
  }

  async function handleSelectedHall(value: string) {
    setSelectedHall(value);
    await updateHall(item?.id, value);
    refetch() // fetch partners
    showBooths(false);
    showHalls(false);

  }

  async function handleSelectedBooth(value: string) {
    setSelectedBooth(value);
    await updateBooth(item?.id, value);
    refetch() // fetch partners
    showBooths(false);
    showHalls(false);
  }

  return (
    <div
      className={cn(
        "w-full grid grid-cols-6 text-sm items-center gap-3 p-3 ",
        className
      )}
    >
      <label className=" w-full flex  relative partner-container">
        <input type="checkbox" />
        <span className="partner-checkmark"></span>
        <p className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
          {item?.companyName}
        </p>
      </label>
      <div className="flex items-center gap-x-2 ">
        <button onClick={() => sendMail(item?.email)}>
          <EmailOutline size={22} />
        </button>
        <button onClick={() => whatsapp(item?.whatsApp)}>
          {" "}
          <Whatsapp size={22} />
        </button>
        <button onClick={() => phoneCall(item?.phoneNumber)}>
          <Call size={22} />
        </button>
      </div>
      <p>{item?.partnerType}</p>
      <p>Amateur</p>
      <button
        onClick={toggleHalls}
        className="flex relative items-center gap-x-1"
      >
        <p className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
          {item?.exhibitionHall || " Select Hall"}
        </p>
        <ArrowIosDownward size={20} />
        {isHall && (
          <DropDownSelect
            handleChange={handleSelectedHall}
            currentValue={selectedHall}
            close={toggleHalls}
            data={hallList}
          />
        )}
      </button>
      <button
        onClick={toggleBooths}
        className="flex items-center relative gap-x-1"
      >
        <p className="">
          {item?.boothNumber || "0"}
        </p>
        <ArrowIosDownward size={20} />
        {isBooth && (
          <DropDownSelect
            handleChange={handleSelectedBooth}
            currentValue={selectedBooth}
            close={toggleBooths}
            data={boothList}
          />
        )}
      </button>
    </div>
  );
}
