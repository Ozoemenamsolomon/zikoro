"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Calendar, LocationIcon1 } from "@/constants/icons";
import { convertCurrencyCodeToSymbol } from "@/utils/currencyConverterToSymbol";

type SelectedLocationProps = {
  id: number;
  eventPoster: string;
  eventTitle: string;
  eventCity: string;
  eventCountry: string;
  locationType: string;
  pricing: [];
  pricingCurrency: string;
  startDateTime: string;
};

interface Price {
  price: number;
}

export default function SelectedLocation({
  id,
  eventPoster,
  eventTitle,
  eventCity,
  eventCountry,
  locationType,
  pricing,
  pricingCurrency,
  startDateTime,
}: SelectedLocationProps) {
  //extract the lowest price in the  array of prices.
  function getLowestPrice(prices: Price[]): number | string {
    if (!prices || prices.length === 0) {
      return "Free"; // Return 'Free' if prices array is empty or undefined
    }

    let lowestPrice: number = prices[0].price; // Initialize lowest price with the first element

    for (let i = 1; i < prices.length; i++) {
      if (prices[i].price < lowestPrice) {
        lowestPrice = prices[i].price;
      }
    }

    return lowestPrice;
  }

  const [lowestPrice, setLowestPrice] = useState<number | string>("Loading...");
  const [date, setDate] = useState<string | null>(null);

  // Extracting the date portion
  function extractDate(dateTimeString: string): string {
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return date.toISOString().split("T")[0]; // Extracting the date portion
    } catch (error) {
      console.error("Error extracting date:", error);
      return "Invalid Date";
    }
  }

  //use Effect
  useEffect(() => {
    setLowestPrice(getLowestPrice(pricing));
    const extractedDate = extractDate(startDateTime);
    setDate(extractedDate);
    console.log(eventPoster);
  }, []);

  //function that shows the event details
  function goToEvent() {
    window.open(`/live-events/${id}`, "_blank");
  }

  return (
    <div className="cursor-pointer" onClick={goToEvent}>
      {/* header */}
      <div className="relative ">
        <Image
          className="object-cover w-full"
          src={
            eventPoster && eventPoster.includes("/cloudinary")
              ? eventPoster
              : "/postImage2.png"
          }
          alt=""
          width={294}
          height={264}
        />
        <p className="text-base font-medium text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end absolute left-4 top-2 py-[5px] px-[10px] rounded-lg">
          {locationType}
        </p>
      </div>

      {/* body */}
      <div className="pl-5 pr-5 border-[1px] border-gray-200 ">
        <p className="mt-5 font-semibold truncate"> {eventTitle} </p>

        <div className="mt-6 flex gap-x-[10px] ">
          <Calendar />
          <p className="text-xl font-normal"> {date} </p>
        </div>

        <div className="mt-[10px] flex gap-x-[10px] mb-8 ">
          <LocationIcon1 />
          <p className="text-xl font-normal truncate">
            {eventCity} ,<span> {eventCountry}</span>{" "}
          </p>
        </div>

        <div className="border-t-[1px] border-gray-200 pt-8 flex justify-between pb-[15px]">
          <p className="text-base font-normal">starting at</p>
          <p className="text-xl font-medium">
            {convertCurrencyCodeToSymbol(pricingCurrency)}
            {lowestPrice}
          </p>
        </div>
      </div>
    </div>
  );
}
