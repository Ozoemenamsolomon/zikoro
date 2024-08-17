"use client";
import React, { useEffect, useState } from "react";
import FeaturedEvent from "./FeaturedEvent";
import { RightArrow } from "@/constants/icons";
import { useRouter } from "next/navigation";

type selectedEventProps = {
  searchQuery: string;
};

type DBFeaturedEvent = {
  id: string;
  eventPoster: string;
  eventTitle: string;
  eventCity: string;
  eventAlias: string;
  eventCategory: string;
  eventCountry: string;
  locationType: string;
  pricing: [];
  pricingCurrency: string;
  startDateTime: string;
  expectedParticipants: number;
  registered: number;
};

export default function FeaturedEventList({ searchQuery }: selectedEventProps) {
  const router = useRouter();
  const [eventData, setEventData] = useState<DBFeaturedEvent[] | undefined>(
    undefined
  );

  //fetch events from database
  async function fetchEventFeautured() {
    fetch("/api/explore", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setEventData(data.data))
      .catch((error) => console.error("Error:", error));
  }

  //filter event
  const filteredEvents = eventData?.filter((event) => {
    // Filter by event title, city, or category
    return (
      event.eventTitle?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      event.eventCity?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      event.eventCategory?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    );
  });

  useEffect(() => {
    fetchEventFeautured();
  }, []);

  return (
    <>
      {eventData && eventData.length > 0 && (
        <div className="mt-[100px] max-w-6xl mx-auto px-3 lg:px-0">
          {/* header */}
          <div className="flex justify-between">
            <p className="font-semibold text-[20px] lg:text-[32px]">
              Browse Events
            </p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-5 lg:gap-y-0 mt-[50px] bg-white ">
            {filteredEvents ? (
              filteredEvents?.length &&
              filteredEvents
                .slice(0, 4)
                .map((event) => (
                  <FeaturedEvent
                    key={event.id}
                    id={event.id}
                    eventPoster={event.eventPoster}
                    eventTitle={event.eventTitle}
                    eventAlias={event.eventAlias}
                    eventCity={event.eventCity}
                    eventCountry={event.eventCountry}
                    eventCategory={event.eventCategory}
                    locationType={event.locationType}
                    pricing={event.pricing}
                    pricingCurrency={event.pricingCurrency}
                    startDateTime={event.startDateTime}
                    expectedParticipants={event.expectedParticipants}
                    registered={event.registered}
                  />
                ))
            ) : (
              <p>No events found</p>
            )}
          </div>

          <div
            onClick={() => router.push("/explore/featured-events")}
            className="flex lg:hidden mt-[30px] justify-end gap-x-4 cursor-pointer items-center"
          >
            <p className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-xl font-semibold">
              See All
            </p>
            <RightArrow />
          </div>
        </div>
      )}
    </>
  );
}
