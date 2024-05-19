"use client";
import React, { useEffect, useState } from "react";
import SelectedLocation from "./SelectedLocation";
import { RightArrow, LocationIcon1 } from "@/constants/icons";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";

type selectedEventProps = {
  searchQuery: string;
};

type DBSelectedLocation = {
  id: number;
  eventPoster: string;
  eventTitle: string;
  eventCategory: string;
  eventCity: string;
  eventAlias: string;
  eventCountry: string;
  locationType: string;
  pricing: [];
  pricingCurrency: string;
  startDateTime: string;
  expectedParticipants: number;
  registered: number;
};

export default function SelectedLocationList({
  searchQuery,
}: selectedEventProps) {
  const router = useRouter();
  const [eventData, setEventData] = useState<DBSelectedLocation[] | undefined>(
    undefined
  );
  const [location, setLocation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchEventFeautured() {
    fetch(`/api/explore?eventCountry=Nigeria`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setEventData(data.data))
      .catch((error) => console.error("Error:", error));
  }

  // const fetchLocation = async () => {
  //   try {
  //     if (typeof window !== "undefined" && navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         async (position: GeolocationPosition) => {
  //           try {
  //             
  //             const response = await fetch(
  //               `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.GOOGLE_API_KEY}`
  //             );
  //             const data = await response.json();
  //             
  //             if (data.status === "OK") {
  //               setLocation(data.results[0].formatted_address);
  //             } else {
  //               setError("Unable to fetch location");
  //             }
  //           } catch (error) {
  //             setError("Error fetching location");
  //           } finally {
  //             setLoading(false);
  //           }
  //         },
  //         (error: GeolocationPositionError) => {
  //           setError(`Error: ${error.message}`);
  //           setLoading(false);
  //         }
  //       );
  //     } else {
  //       setError("Geolocation is not supported by your browser");
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     setError("Error detecting location");
  //     setLoading(false);
  //   }
  // };

  //filter event
  const filteredEvents = eventData?.filter((event) => {
    // Filter by event title, city, or category
    return (
      event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  useEffect(() => {
    fetchEventFeautured();
    // fetchLocation();
  }, []);

  return (
    <>
      {eventData && eventData.length > 0 && (
        <div className="mt-[150px] max-w-6xl mx-auto px-3 lg:px-0">
          {/* header */}
          <div className="flex justify-between">
            <div className="flex items-center gap-x-1 lg:gap-x-3">
              <LocationIcon1 />
              <div className="font-semibold text-[20px] lg:text-[32px]">
                {/* {loading ? (
                 <p>Loading...</p>
               ) : error ? (
                 <p>{error}</p>
               ) : location ? (
                 <p className="">{location}</p>
               ) : null} */}
                Nigeria
              </div>
            </div>

            {eventData && eventData.length > 4 && (
              <div
                // onClick={() => router.push("/explore/featured-events")}
                className="hidden lg:flex gap-x-4 cursor-pointer items-center"
              >
                <p className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-xl font-semibold">
                  See All
                </p>
                <RightArrow />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-0 md:gap-x-4 lg:gap-x-4 gap-y-5 lg:gap-y-0 mt-[10px] lg:mt-[50px] bg-white  ">
            {filteredEvents?.length &&
              filteredEvents.map((event, index) => (
                <SelectedLocation
                  key={event.id}
                  id={event.id}
                  eventPoster={event.eventPoster}
                  eventTitle={event.eventTitle}
                  eventCity={event.eventCity}
                  eventAlias={event.eventAlias}
                  eventCountry={event.eventCountry}
                  eventCategory={event.eventCategory}
                  locationType={event.locationType}
                  pricing={event.pricing}
                  pricingCurrency={event.pricingCurrency}
                  startDateTime={event.startDateTime}
                  expectedParticipants={event.expectedParticipants}
                  registered={event.registered}
                />
              ))}
          </div>

          {eventData && eventData.length > 4 && (
            <div
              onClick={() => router.push("/explore/featured-events")}
              className=" justify-end mt-[30px] flex lg:hidden gap-x-4 cursor-pointer items-center"
            >
              <p className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-xl font-semibold">
                See All
              </p>
              <RightArrow />
            </div>
          )}
        </div>
      )}
    </>
  );
}
