"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, LocationIcon1 } from "@/constants/icons";
import { convertCurrencyCodeToSymbol } from "@/utils/currencyConverterToSymbol";
import { getLowestPrice } from "@/utils/getLowestPrice";
import { addCommasToPrice } from "@/utils/priceSeprator";
import checkDateEqualToday from "@/utils/checkDateEqualToday";
import checkEventFull from "@/utils/checkEventFull";

type FeaturedEventProps = {
  id: string;
  eventPoster: string;
  eventTitle: string;
  eventCity: string;
  eventCountry: string;
  eventCategory: string;
  eventAlias: string;
  locationType: string;
  pricing: [];
  pricingCurrency: string;
  startDateTime: string;
  expectedParticipants: number;
  registered: number;
};

export default function FeaturedEvent({
  id,
  eventPoster,
  eventTitle,
  eventCity,
  eventCountry,
  eventCategory,
  eventAlias,
  locationType,
  pricing,
  pricingCurrency,
  startDateTime,
  expectedParticipants,
  registered,
}: FeaturedEventProps) {
  const [lowestPrice, setLowestPrice] = useState<any>("Loading...");
  const [date, setDate] = useState<string | null>(null);
  const [currencySymbol, setCurrencySymbol] = useState<string | null>(null);
  const [soldOut, setSoldOut] = useState<boolean>(false);
  const [elapsed, setElapsed] = useState<boolean>(false);

  // Extracting the date only
  function extractAndFormatDate(dateTimeString: string): string {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      const formattedDate: string = formatDate(date);
      return formattedDate;
    } catch (error) {
      console.error("Error extracting date:", error);
      return "Invalid Date";
    }
  }
  //FORMAT DATE INTO STRINGS
  function formatDate(date: Date): string {
    const year: number = date.getFullYear();
    const month: number = date.getMonth() + 1; // Month is zero-based, so add 1
    const day: number = date.getDate();

    const monthNames: string[] = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formattedDate: string = `${day} ${monthNames[month - 1]} ${year}`;
    return formattedDate;
  }

  //function that shows the event details
  function goToEvent() {
    window.open(`/live-events/${eventAlias}`, "_blank");
  }

  //useEffect
  useEffect(() => {
    //extract the lowest price
    setLowestPrice(getLowestPrice(pricing));

    //extract date
    const extractedDate = extractAndFormatDate(startDateTime);
    setDate(extractedDate);

    //convert currency shortCode to currencySymbol
    setCurrencySymbol(convertCurrencyCodeToSymbol(pricingCurrency));

    //check date and time
    if (checkDateEqualToday(startDateTime)) {
      setElapsed(true);
    } else {
      setElapsed(false);
    }

    //check if sold out
    if (checkEventFull(expectedParticipants, registered)) {
      setSoldOut(true);
    } else {
      setSoldOut(false);
    }
  }, []);

  return (
    <>
      {!elapsed && (
        <div
          className={`cursor-pointer relative ${
            elapsed || soldOut ? "opacity-50" : ""
          }`}
          onClick={goToEvent}
        >
          {/* header */}
          <div className="relative ">
            <Image
              className="object-cover w-full lg:w-[294px] h-[150px]"
              src={
                eventPoster && eventPoster.includes("res.cloudinary.com")
                  ? eventPoster
                  : "/postImage2.png"
              }
              alt=""
              width={294}
              height={150}
            />
            <p className="text-sm font-medium text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end absolute left-4 top-2 py-[5px] px-[10px] rounded-lg ">
              {locationType}
            </p>

            {soldOut && (
              <p className="text-sm font-medium text-white bg-green-500 absolute right-2 top-2 py-[5px] px-[10px] rounded-lg ">
                Sold Out
              </p>
            )}

            {elapsed && (
              <p className="text-sm font-medium text-white bg-red-500 absolute left-4 top-2 py-[5px] px-[10px] rounded-lg ">
                Elapsed
              </p>
            )}
          </div>

          {/* body */}
          <div className="pl-5 pr-5 border-[1px] border-gray-200 ">
            <p className="mt-5 font-medium text-lg truncate"> {eventTitle} </p>

            <div className="mt-6 flex gap-x-[10px] items-center ">
              <Calendar />
              <p className="text-sm font-normal"> {date} </p>
            </div>

            <div className="mt-[10px] flex gap-x-[10px] mb-8 items-center">
              <LocationIcon1 />
              <p className="text-sm font-normal truncate">
                {eventCity},<span> {eventCountry}</span>
              </p>
            </div>

            <div className="border-t-[1px] border-gray-200 pt-8 flex justify-between pb-[15px]">
              <p className="text-sm font-normal">starting at</p>
              <p className="text-base font-semibold">
                {lowestPrice != "Free" && currencySymbol}
                {lowestPrice != "Free"
                  ? addCommasToPrice(lowestPrice)
                  : lowestPrice}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
