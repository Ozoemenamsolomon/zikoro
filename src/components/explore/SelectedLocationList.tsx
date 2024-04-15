"use client";
import React, { useEffect, useState } from "react";
import SelectedLocation from "./SelectedLocation";
import { RightArrow, LocationIcon1 } from "@/constants/icons";
import { useRouter } from "next/navigation";

export default function SelectedLocationList() {
  const router = useRouter();

  type DBSelectedLocation = {
    id: number;
    eventPoster: [];
    eventTitle: string;
    eventCity: string;
    eventCountry: string;
    locationType: string;
    pricing: [];
    pricingCurrency: string;
    startDateTime: string;
  };

  //fetch events from database
  const [eventData, setEventData] = useState<DBSelectedLocation[] | undefined>(
    undefined
  );

  async function fetchEventFeautured() {
    fetch("/api/explore?eventCity=lagos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setEventData(data.data))
      .catch((error) => console.error("Error:", error));
  }

  useEffect(() => {
    fetchEventFeautured();
  }, []);

  return (
    <div className="mt-[150px] max-w-6xl mx-auto px-3 lg:px-0">
      {/* header */}
      <div className="flex justify-between">
        <div className="flex items-center gap-x-1 lg:gap-x-3">
          <LocationIcon1 />
          <p className="font-semibold text-[20px] lg:text-[32px]">Lagos</p>
        </div>
        <div
          onClick={() => router.push("/explore/featured-events")}
          className="hidden lg:flex gap-x-4 cursor-pointer items-center"
        >
          <p className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-xl font-semibold">
            See All
          </p>
          <RightArrow />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-0 md:gap-x-4 lg:gap-x-4 gap-y-5 lg:gap-y-0 mt-[10px] lg:mt-[50px] bg-white  ">
        {eventData?.length &&
          eventData?.map((event, index) => (
            <SelectedLocation
              key={event.id}
              id = {event.id}
              eventPoster={event.eventPoster}
              eventTitle={event.eventTitle}
              eventCity={event.eventCity}
              eventCountry={event.eventCountry}
              locationType={event.locationType}
              pricing={event.pricing}
              pricingCurrency={event.pricingCurrency}
              startDateTime={event.startDateTime}
            />
          ))}
      </div>

      <div
        onClick={() => router.push("/explore/featured-events")}
        className=" justify-end mt-[30px] flex lg:hidden gap-x-4 cursor-pointer items-center"
      >
        <p className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-xl font-semibold">
          See All
        </p>
        <RightArrow />
      </div>
    </div>
  );
}
