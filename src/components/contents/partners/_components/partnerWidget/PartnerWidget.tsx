"use client";

import { sendMail, phoneCall, whatsapp } from "@/utils";
import { ArrowIosDownward } from "@styled-icons/evaicons-solid/ArrowIosDownward";
import { Phone } from "@styled-icons/feather/Phone";
import { cn } from "@/lib";
import { useState, useMemo, useEffect } from "react";
import { DropDownSelect } from "@/components/contents/_components";
import { Event } from "@/types";
import {
  useUpdateHall,
  useUpdateBooth,
  useUpdatePartnerType,
  useUpdateSponsor,
} from "@/hooks";
import { EmailIcon, WhatsappIcon } from "@/constants";
import { useDropBoxPosition } from "@/context";

export function PartnerWidget({
  item,
  event,
  className,
  refetch,
  selectRowFn,
  selectedRows,
  partners,
}: {
  className: string;
  item: any;
  refetch: () => Promise<any>;
  event: Event | null;
  selectRowFn: (value: number) => void;
  selectedRows: number[];
  partners: any[];
}) {
  const [isHall, showHalls] = useState(false);
  const [isBooth, showBooths] = useState(false);
  const [isSponsorLevel, showSponsorDropDown] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState("");
  const [selectedHall, setSelectedHall] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [boothList, setBoothList] = useState<string[]>([]);
  const [isPartnerType, showPartnerType] = useState(false);
  const { updateHall } = useUpdateHall();
  const { updateBooth } = useUpdateBooth();
  const { updatePartnerType } = useUpdatePartnerType();
  const { updateSponsorCategory } = useUpdateSponsor();
  const { getClientPosition } = useDropBoxPosition();

  // format hall list
  const hallList = useMemo(() => {
    if (event) {
      return event.exhibitionHall?.map(({ name }) => name);
    }
  }, [event]);

  // format sponsor level
  const levelList = useMemo(() => {
    if (event) {
      return event?.sponsorCategory?.map(({ type }) => type);
    }
  }, [event]);

  // format booth list
  useEffect(() => {
    if (item?.exhibitionHall) {
      // if an hall has been selected
      const hall = item?.exhibitionHall;

      // fetch the hall booth number
      const hallBoothNumber = event?.exhibitionHall.find(
        ({ name }) => name.toLowerCase() === hall.toLowerCase()
      )?.capacity;

      const numbers = Array.from(
        { length: Number(hallBoothNumber) },
        (_, index) => String(index + 1)
      );
      // get all partners with the exhibition hall
      const partnersWithHall = partners.filter(
        ({ exhibitionHall }) => exhibitionHall === hall
      );

      // get their booth numbers
      const boothNumbers = partnersWithHall.map((item) => {
        if (item?.boothNumber && Array.isArray(item?.boothNumber)) {
          return item?.boothNumber
           
        }
      });

      const filterBoothNumber = boothNumbers.filter((v) => v !== undefined).flat()
    
      // remove the boothNumber from the availabe booths
      const booths = numbers.filter((number) => !filterBoothNumber.includes(number));

      setBoothList(booths);
    }
  }, [selectedHall, item?.exhibitionHall]);

  function toggleBooths() {
    showBooths((prev) => !prev);
  }
  function toggleHalls() {
    showHalls((prev) => !prev);
  }

  function toggleLevelDropDown() {
    showSponsorDropDown((prev) => !prev);
  }

  function togglePartnerType() {
    showPartnerType((prev) => !prev);
  }

  async function handleSelectedHall(value: string) {
    setSelectedHall(value);
    await updateHall(item?.id, value);
    refetch(); // fetch partners

    showHalls(false);
  }

  async function handleSelectedBooth(value: string) {
    setSelectedBooth(value);
    await updateBooth(item?.id, value);
    refetch(); // fetch partners
    showBooths(false);
  }

  async function handleSelectedPartner(value: string) {
    setSelectedPartner(value);
    await updatePartnerType(item?.id, value);
    refetch(); // fetch partners
    showPartnerType(false);
  }

  async function handleSelectedLevel(value: string) {
    setSelectedLevel(value);
    await updateSponsorCategory(item?.id, value);
    refetch(); // fetch partners
    showSponsorDropDown(false);
  }

  return (
    <tr
      className={cn(
        "w-full grid grid-cols-7 text-sm items-center gap-3 p-3 ",
        className
      )}
    >
      <label className="col-span-2 w-full flex  relative partner-container">
        <input
          checked={selectedRows.includes(item?.id)}
          onChange={() => selectRowFn(item?.id)}
          type="checkbox"
        />
        <span className="partner-checkmark"></span>
        <p className="w-full text-ellipsis whitespace-nowrap overflow-hidden">
          {item?.companyName}
        </p>
      </label>
      <td className="flex items-center gap-x-2 ">
        <button onClick={() => sendMail(item?.email)}>
          <EmailIcon />
        </button>
        <button onClick={() => whatsapp(item?.whatsApp)}>
          {" "}
          <WhatsappIcon />
        </button>
        <button onClick={() => phoneCall(item?.phoneNumber)}>
          <Phone size={22} />
        </button>
      </td>
      <td>
        <button
          onClick={(e: any) => {
            getClientPosition(e);
            togglePartnerType();
          }}
          className="flex relative items-center gap-x-1"
        >
          <p className="w-fit text-start text-ellipsis whitespace-nowrap overflow-hidden">
            {item?.partnerType || "Select Type"}
          </p>
          <ArrowIosDownward size={20} />
          {isPartnerType && (
            <DropDownSelect
              handleChange={handleSelectedPartner}
              currentValue={selectedPartner}
              close={togglePartnerType}
              data={["Exhibitor", "Sponsor"]}
            />
          )}
        </button>
      </td>

      <td>
        {item?.partnerType.toLowerCase() === "sponsor" ? (
          <button
            onClick={(e: any) => {
              getClientPosition(e);
              toggleLevelDropDown();
            }}
            className="flex relative items-center gap-x-1"
          >
            <p className="w-fit text-start text-ellipsis whitespace-nowrap overflow-hidden">
              {item?.sponsorCategory || " Select Level"}
            </p>
            <ArrowIosDownward size={20} />
            {isSponsorLevel && (
              <DropDownSelect
                handleChange={handleSelectedLevel}
                currentValue={selectedLevel}
                close={toggleLevelDropDown}
                data={levelList}
              />
            )}
          </button>
        ) : (
          <p className="w-1 h-1"></p>
        )}
      </td>

      <td>
        <button
          onClick={(e: any) => {
            getClientPosition(e);
            toggleHalls();
          }}
          className="flex relative items-center gap-x-1"
        >
          <p className="w-fit text-start text-ellipsis whitespace-nowrap overflow-hidden">
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
      </td>
      <td>
        <button
          onClick={(e: any) => {
            if (!item?.exhibitionHall) return;
            getClientPosition(e);
            toggleBooths();
          }}
          className="flex items-center relative gap-x-1"
        >
          <p className="">{item?.boothNumber?.toString() || "0"}</p>
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
      </td>
    </tr>
  );
}