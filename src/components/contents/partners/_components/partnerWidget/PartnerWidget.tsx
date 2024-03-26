"use client";

import { sendMail, phoneCall, whatsapp } from "@/utils";
import { ArrowIosDownward } from "@styled-icons/evaicons-solid/ArrowIosDownward";
import { Phone } from "@styled-icons/feather/Phone";
import { cn } from "@/lib";
import { useState, useMemo, useEffect, useRef } from "react";
import { DropDownSelect } from "@/components/contents/_components";
import { Event } from "@/types";
import {
  useUpdateHall,
  useUpdateBooth,
  useUpdatePartnerType,
  useUpdateSponsor,
} from "@/hooks";
import { EmailIcon, WhatsappIcon } from "@/constants";

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
  const [boothList, setBoothList] = useState<string[]>([]);
  const { updateHall } = useUpdateHall();
  const { updateBooth } = useUpdateBooth();
  const { updatePartnerType } = useUpdatePartnerType();
  const { updateSponsorCategory } = useUpdateSponsor();

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
          console.log(item?.boothNumber)
          return item?.boothNumber[0]?.split(",")
        }
      });
      console.log({ddd:boothNumbers})

      const filterBoothNumber = boothNumbers
        .filter((v) => v !== undefined)
        .flat();

      // remove the boothNumbers from the availabe booths
      const booths = numbers.filter(
        (number) => !filterBoothNumber.includes(number)
      );

      setBoothList(booths);
    }
  }, [item?.exhibitionHall]);


  async function handleSelectedHall(value: string) {
    // setSelectedHall(value);
    await updateHall(item?.id, value);
    refetch(); // fetch partners

   
  }

  // check if any of partner hall has been deleted
  // delete the hall and booth number from the partner data
  useEffect(() => {
    (async () => {
      if (event) {
        //  hall
        const hall = item?.exhibitionHall;
        if (hall === null) return;

        //check if the hall is still available
        const isHallPresent = event?.exhibitionHall.some(
          ({ name }) => name.toLowerCase() === hall?.toLowerCase()
        );
        // when the hall is not available then, remove it from this partner data
        if (!isHallPresent) {
          await updateBooth(item?.id, null);
          await updateHall(item?.id, null);
          refetch(); // fetch partners
        }
      }
    })();
  }, [event]);

  async function handleSelectedBooth(value: string) {
 
    await updateBooth(item?.id, value);
    refetch(); // fetch partners
  
  }

  async function handleSelectedPartner(value: string) {

    await updatePartnerType(item?.id, value);
    refetch(); // fetch partners
   
  }

  async function handleSelectedLevel(value: string) {
   // setSelectedLevel(value);
    await updateSponsorCategory(item?.id, value);
    refetch(); // fetch partners
  
  }

  return (
    <tr
      className={cn(
        "w-full grid grid-cols-7 text-sm items-center gap-3 p-3 ",
        className
      )}
    >
      <label className="col-span-2 w-full flex  relative items-center gap-x-2">
        <input
          checked={selectedRows.includes(item?.id)}
          onChange={() => selectRowFn(item?.id)}
          type="checkbox"
          className="accent-basePrimary w-4 h-4"
        />

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
        

        <DropDownSelect
          handleChange={handleSelectedPartner}
          data={["Exhibitor", "Sponsor"]}
          className="w-full"
        >
          <button className="flex relative items-center gap-x-1">
            <p className="w-fit text-start text-ellipsis whitespace-nowrap overflow-hidden">
              {item?.partnerType || "Select Type"}
            </p>
            <ArrowIosDownward size={20} />
          </button>
        </DropDownSelect>
      </td>

      <td>
        {item?.partnerType.toLowerCase() === "sponsor" ? (
          <DropDownSelect
            handleChange={handleSelectedLevel}
            data={levelList}
          >
            <button className="flex relative items-center gap-x-1">
              <p className="w-fit text-start text-ellipsis whitespace-nowrap overflow-hidden">
                {item?.sponsorCategory || " Select Level"}
              </p>
              <ArrowIosDownward size={20} />
            </button>
          </DropDownSelect>
        ) : (
          <p className="w-1 h-1"></p>
        )}
      </td>

      <td>
        <DropDownSelect
          handleChange={handleSelectedHall}
          
          data={hallList}
        >
          <button
          
            className="flex relative items-center gap-x-1"
          >
            <p className="w-fit text-start text-ellipsis whitespace-nowrap overflow-hidden">
              {item?.exhibitionHall || " Select Hall"}
            </p>
            <ArrowIosDownward size={20} />
          </button>
        
        </DropDownSelect>
      </td>
      <td>
        <DropDownSelect
          handleChange={handleSelectedBooth}
          isMultiple
          data={boothList}
          className={item?.exhibitionHall ? "block" : "hidden"}
        >
          <button
           
            className="flex items-center relative gap-x-1"
          >
            <p className="">{item?.boothNumber?.toString() || "0"}</p>
            <ArrowIosDownward size={20} />
          </button>
        </DropDownSelect>
      </td>
    </tr>
  );
}
