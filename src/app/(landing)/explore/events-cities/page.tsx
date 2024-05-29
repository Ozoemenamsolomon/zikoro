"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CopyrightFooter from "@/components/CopyrightFooter";
import CityEvent from "@/components/explore/CityEvent";

export default function EventsCities() {
  const [data, setData] = useState<any[]>([]);
  const [showMore, setShowMore] = useState(false);

  async function fetchEventCities() {
    fetch("/api/explore/cities", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setData(data.data))
      .catch((error) => console.error("Error:", error));
  }

  //see more function
  const handleSeeMoreClick = () => {
    setShowMore(true);
  };

  useEffect(() => {
    fetchEventCities();
  }, []);

  const renderedCities = new Set(); // Set to store rendered cities

  return (
    <>
      {data && data.length > 0 && (
        <div className="">
          <Navbar />
          {/* header */}
          <div className="px-1 lg:px-0 max-w-full lg:max-w-6xl mx-auto pb-12 mt-40 lg:mt-48">
            <div className="mt-24 text-center">
              <p className="text-[24px] lg:text-[40px]  gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end font-bold">
                Events in cities near you
              </p>
              <p className="text-[16px] lg:text-[24px] font-normal">
                Discover exciting events in different cities across the globe
              </p>
            </div>
            {/* Events categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-5 lg:gap-y-12 mt-12 lg:mt-24 px-2 lg:px-0">
              {data?.length &&
                (showMore ? data : data.slice(0, 20)).map((city, index) => {
                  // Count the number of occurrences of the current city in the data array
                  const cityCount = data.filter(
                    (c) => c.eventCity === city.eventCity
                  ).length;

                  if (city.eventCity && !renderedCities.has(city.eventCity)) {
                    renderedCities.add(city.eventCity); // Add city to renderedCities set
                    return (
                      <CityEvent
                        key={index}
                        cityName={city.eventCity}
                        cityCount={cityCount}
                      />
                    );
                  } else {
                    return null; // Render nothing if city has already been rendered
                  }
                })}
            </div>

            {data.length > 16 && !showMore && (
              <div className=" flex justify-center items-center mt-12 ">
                <button
                  onClick={handleSeeMoreClick}
                  className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white"
                >
                  See more
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <CopyrightFooter />
        </div>
      )}
    </>
  );
}
