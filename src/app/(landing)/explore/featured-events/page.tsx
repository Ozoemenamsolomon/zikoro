"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FilterIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CloseIcon,
} from "@/constants/icons";
import FeaturedEvent from "@/components/explore/FeaturedEvent";

type DBFeaturedEvent = {
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
// type EventCategoryData = {
//   eventCategory: string; // Adjust the type accordingly
// };

export default function FeaturedEvents() {
  const [showMore, setShowMore] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [isEventDateUp, setEventDateUp] = useState(false);
  const [isEventTypeUp, setEventTypeUp] = useState(false);
  const [isCountryUp, setCountryUp] = useState(false);
  const [isCityUp, setCityUp] = useState(false);
  const [isPriceUp, setPriceUp] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventData, setEventData] = useState<DBFeaturedEvent[] | undefined>(
    undefined
  );
  const [eventCategories, setEventCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredEvents = eventData?.filter((event) => {
    // Filter by event title, city, or category
    return (
      event.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventCategory.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleClick = (v: string) => {
    setSelectedButton(v);
  };

  //see more function
  const handleSeeMoreClick = () => {
    setShowMore(true);
  };

  //clear filter button
  const clearFilterButton = () => {
    selectedButton === null;
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  //fetch events from database

  async function fetchEventFeautured() {
    fetch("/api/explore/featured", {
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

  useEffect(() => {
    if (eventData) {
      const categories: string[] = eventData.map(
        (event) => event.eventCategory
      );
      setEventCategories(categories);
    }
  }, [eventData]); // Update eventCategories when eventData changes

  return (
    <>
      {eventData && eventData.length > 0 && (
        <div className="">
          {/* normal screen */}
          {!isFilterOpen && (
            <div>
              <Navbar />
              {/* header */}
              <div>
                {/* big screen */}
                <div className="px-0 max-w-full lg:max-w-7xl mx-auto mt-40 lg:mt-48 hidden lg:block ">
                  <div className="mt-24 text-center">
                    <p className="text-[40px]  gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end font-bold">
                      Featured Events
                    </p>
                    <p className="text-[24px] font-normal">
                      A collection of events hand-picked for you
                    </p>
                  </div>

                  {/* mt-12       */}
                  <div className="h-[48px] flex justify-between gap-x-3 max-w-lg mx-auto items-center mt-6">
                    <div className=" p-1 border-[1px] border-indigo-800 rounded-xl w-[500px] h-full">
                      <input
                        type="text"
                        value={searchQuery}
                        name="searchBox"
                        onChange={handleChange}
                        placeholder="search by event name, city, category"
                        className="pl-4 outline-none text-base text-gray-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl w-full h-full"
                      />
                    </div>

                    {/* <button className="bg-gradient-to-tr flex-1 from-custom-gradient-start to-custom-gradient-end text-white cursor-pointer px-5 py-[13px] text-base rounded-lg">
                       {" "}
                       Search
                     </button> */}
                  </div>

                  {/* main section */}
                  <div className="flex flex-col lg:flex-row justify-between mt-[50px] border-l-[1px] border-gray-200 rounded-none">
                    {/* left */}
                    <div className="border-t-[1px] border-gray-200 h-full pb-12 w-full lg:w-3/12 ">
                      <div className="flex gap-x-3 py-[43px] px-[30px] border-b-[1px] border-gray-200">
                        <FilterIcon />
                        <p className="text-xl font-semibold"> Filters</p>
                      </div>

                      <div className="flex flex-col gap-y-12 mt-7">
                        {/* 1st section */}
                        <div className="px-8 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">Event Type</p>
                            {isEventTypeUp ? (
                              <div
                                onClick={() => setEventTypeUp(!isEventTypeUp)}
                              >
                                <ArrowUpIcon />
                              </div>
                            ) : (
                              <div
                                onClick={() => setEventTypeUp(!isEventTypeUp)}
                              >
                                <ArrowDownIcon />
                              </div>
                            )}
                          </div>
                          {isEventTypeUp && (
                            <div className="grid grid-cols-2 2xl:grid-cols-3 gap-[10px] mt-8">
                              <button
                                onClick={() => handleClick("hybrid")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "hybrid"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Hybrid
                              </button>
                              <button
                                onClick={() => handleClick("onsite")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "onsite"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Onsite
                              </button>
                              <button
                                onClick={() => handleClick("virtual")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "virtual"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Virtual
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 2nd section */}
                        <div className="px-8 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <p className="text-lg  font-semibold">Event Date</p>
                            {isEventDateUp ? (
                              <div
                                onClick={() => setEventDateUp(!isEventDateUp)}
                              >
                                <ArrowUpIcon />
                              </div>
                            ) : (
                              <div
                                onClick={() => setEventDateUp(!isEventDateUp)}
                              >
                                <ArrowDownIcon />
                              </div>
                            )}
                          </div>
                          {isEventDateUp && (
                            <div className="grid grid-cols-2 2xl:grid-cols-3 gap-[10px] mt-8">
                              <button
                                onClick={() => handleClick("today")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "today"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Today
                              </button>
                              <button
                                onClick={() => handleClick("this-week")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "this-week"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                This Week
                              </button>
                              <button
                                onClick={() => handleClick("this-month")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "this-month"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                This Month
                              </button>
                              <button
                                onClick={() => handleClick("next-month")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "next-month"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Next Month
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 3rd section */}
                        <div className="px-8 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">Country</p>
                            {isCountryUp ? (
                              <div onClick={() => setCountryUp(!isCountryUp)}>
                                <ArrowUpIcon />
                              </div>
                            ) : (
                              <div onClick={() => setCountryUp(!isCountryUp)}>
                                <ArrowDownIcon />
                              </div>
                            )}
                          </div>
                          {isCountryUp && (
                            <div className="grid grid-cols-2 2xl:grid-cols-3 gap-[10px] mt-8">
                              <button
                                onClick={() => handleClick("nigeria")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap  rounded-lg ${
                                  selectedButton === "nigeria"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Nigeria
                              </button>
                              <button
                                onClick={() => handleClick("germany")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "germany"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Germany
                              </button>
                              <button
                                onClick={() => handleClick("usa")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "usa"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                U.S.A
                              </button>
                              <button
                                onClick={() => handleClick("uk")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "uk"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                U.K
                              </button>
                              <button
                                onClick={() => handleClick("ghana")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "ghana"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Ghana
                              </button>

                              <button
                                onClick={() => handleClick("canada")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "canada"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Canada
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 4th section */}
                        <div className="px-8 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">City</p>
                            {isCityUp ? (
                              <div onClick={() => setCityUp(!isCityUp)}>
                                <ArrowUpIcon />
                              </div>
                            ) : (
                              <div onClick={() => setCityUp(!isCityUp)}>
                                <ArrowDownIcon />
                              </div>
                            )}
                          </div>
                          {isCityUp && (
                            <div className="grid grid-cols-2 2xl:grid-cols-3 gap-[10px] mt-8">
                              <button
                                onClick={() => handleClick("lagos")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "lagos"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Lagos
                              </button>
                              <button
                                onClick={() => handleClick("abuja")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "abuja"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Abuja
                              </button>
                              <button
                                onClick={() => handleClick("enugu")}
                                className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "enugu"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Enugu
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 5th section */}
                        <div className="px-8 cursor-pointer">
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-semibold">Price Range</p>
                            {isPriceUp ? (
                              <div onClick={() => setPriceUp(!isPriceUp)}>
                                <ArrowUpIcon />
                              </div>
                            ) : (
                              <div onClick={() => setPriceUp(!isPriceUp)}>
                                <ArrowDownIcon />
                              </div>
                            )}
                          </div>
                          {isPriceUp && (
                            <div className="grid grid-cols-2 2xl:grid-cols-3 gap-[10px] mt-8">
                              <button
                                onClick={() => handleClick("free")}
                                className={`py-4 px-5 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "free"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Free
                              </button>
                              <button
                                onClick={() => handleClick("1-10")}
                                className={`py-4 px-5 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton === "1-10"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                1k -10k
                              </button>
                              <button
                                onClick={() => handleClick("10-50")}
                                className={`py-4 px-5 text-base border-[1px] border-gray-200 whitespace-nowrap  rounded-lg ${
                                  selectedButton === "10-50"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                10k -50k
                              </button>
                              <button
                                onClick={() => handleClick("50-100")}
                                className={`py-4 px-5 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButton == "50-100"
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                50k - 100k
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className=" border-t-[1px] border-gray-200 border-l-[1px] border-r-[1px] w-full lg:w-9/12 py-[3px] ">
                      {/* top */}
                      <div className="flex">
                        <div className=" px-4 flex w-[950px] items-center overflow-x-auto no-scrollbar py-7 gap-x-[10px] ">
                          {eventCategories.map((eventCategory, i) => (
                            <div
                              key={i}
                              className="py-[18px] px-5 t w-auto  cursor-pointer text-sm border-[1px] border-gray-200 rounded-lg whitespace-nowrap"
                            >
                              {eventCategory}{" "}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* bottom h-[1485px] */}
                      <div className="py-2 px-4 h-auto flex flex-col justify-start border-t-[1px] border-gray-200  items-center overflow-y-auto no-scrollbar pt-8 pb-0 lg:pb-[50px]">
                        <div className="grid grid-cols-3 gap-4 mt-8 ">
                          {filteredEvents &&
                            (showMore
                              ? filteredEvents
                              : filteredEvents.slice(0, 20)
                            ).map((event, index) => (
                              <FeaturedEvent
                                key={event.id}
                                id={event.id}
                                eventPoster={event.eventPoster}
                                eventTitle={event.eventTitle}
                                eventCity={event.eventCity}
                                eventCountry={event.eventCountry}
                                eventCategory={event.eventCategory}
                                eventAlias={event.eventAlias}
                                locationType={event.locationType}
                                pricing={event.pricing}
                                pricingCurrency={event.pricingCurrency}
                                startDateTime={event.startDateTime}
                                expectedParticipants={
                                  event.expectedParticipants
                                }
                                registered={event.registered}
                              />
                            ))}
                        </div>

                        {eventData && eventData.length > 20 && !showMore && (
                          <div className="flex justify-center items-center pt-12">
                            <button
                              onClick={handleSeeMoreClick}
                              className="text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white"
                            >
                              See more
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* small screen */}
                <div className="block lg:hidden px-3 mt-40 ">
                  <div className="mt-24 ">
                    <p className=" text-center text-[24px] gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end font-bold">
                      Featured Events
                    </p>
                    <p className="text-base text-center font-normal">
                      A collection of events hand-picked for you
                    </p>

                    <div className="">
                      <div className="h-[58px] pt-[15px] flex justify-between gap-x-3 items-center">
                        <div className=" p-1 border-[1px] border-indigo-800 rounded-xl w-11/12 h-full">
                          <input
                            type="text"
                            value={searchQuery}
                            name="searchBox"
                            onChange={handleChange}
                            placeholder="search by event name, city, category"
                            className="pl-4 outline-none text-base text-gray-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl w-full h-full"
                          />
                        </div>
                        <div onClick={() => setFilterOpen(true)}>
                          <FilterIcon />
                        </div>
                      </div>
                    </div>

                    <div className="mt-7">
                      <div className=" px-4 flex w-auto items-center overflow-x-auto no-scrollbar py-7 gap-x-[10px] border-y-[1px] border-gray-200 ">
                        {eventCategories.map((eventCategory, i) => (
                          <div
                            key={i}
                            className="py-[18px] px-5 w-auto  cursor-pointer text-sm border-[1px] border-gray-200 rounded-lg whitespace-nowrap"
                          >
                            {eventCategory}{" "}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-center mt-16 mb-20 ">
                      <div className="grid grid-cols-1 gap-4 w-full ">
                        {filteredEvents &&
                          (showMore
                            ? filteredEvents
                            : filteredEvents.slice(0, 20)
                          ).map((event, index) => (
                            <FeaturedEvent
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

                      {eventData && eventData.length > 20 && !showMore && (
                        <div className="flex justify-center items-center pt-12">
                          <button
                            onClick={handleSeeMoreClick}
                            className="text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-5 rounded-md border border-white"
                          >
                            See more
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Footer />
            </div>
          )}

          {/* Filter Screen */}
          {isFilterOpen && (
            <div className="block lg:hidden">
              <div className="flex py-6 px-5 items-center justify-between border-b-[1px] border-gray-300 ">
                <div className="flex gap-x-3 items-center">
                  <div onClick={() => setFilterOpen(false)}>
                    <CloseIcon />
                  </div>
                  <p className="text-[14px] font-semibold">Filter Events</p>
                </div>
                <button
                  onClick={clearFilterButton}
                  className="p-[10px] border-[1px] border-gray-300 text-[14px] font-normal"
                >
                  clear all
                </button>
              </div>

              <div>
                <div className="flex flex-col gap-y-12 my-7 ">
                  {/* 1st section */}
                  <div className="px-8 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">Event Type</p>
                      {isEventTypeUp ? (
                        <div onClick={() => setEventTypeUp(!isEventTypeUp)}>
                          <ArrowUpIcon />
                        </div>
                      ) : (
                        <div onClick={() => setEventTypeUp(!isEventTypeUp)}>
                          <ArrowDownIcon />
                        </div>
                      )}
                    </div>
                    {isEventTypeUp && (
                      <div className="grid grid-cols-2 2xl:grid-cols-3 gap-[10px] mt-8">
                        <button
                          onClick={() => handleClick("hybrid")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "hybrid"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Hybrid
                        </button>
                        <button
                          onClick={() => handleClick("onsite")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "onsite"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Onsite
                        </button>
                        <button
                          onClick={() => handleClick("virtual")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "virtual"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Virtual
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 2nd section */}
                  <div className="px-8 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <p className="text-lg  font-semibold">Event Date</p>
                      {isEventDateUp ? (
                        <div onClick={() => setEventDateUp(!isEventDateUp)}>
                          <ArrowUpIcon />
                        </div>
                      ) : (
                        <div onClick={() => setEventDateUp(!isEventDateUp)}>
                          <ArrowDownIcon />
                        </div>
                      )}
                    </div>
                    {isEventDateUp && (
                      <div className="grid grid-cols-2 2xl:grid-cols-3 gap-[10px] mt-8">
                        <button
                          onClick={() => handleClick("today")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "today"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Today
                        </button>
                        <button
                          onClick={() => handleClick("this-week")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "this-week"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          This Week
                        </button>
                        <button
                          onClick={() => handleClick("this-month")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "this-month"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          This Month
                        </button>
                        <button
                          onClick={() => handleClick("next-month")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "next-month"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Next Month
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 3rd section */}
                  <div className="px-8 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">Country</p>
                      {isCountryUp ? (
                        <div onClick={() => setCountryUp(!isCountryUp)}>
                          <ArrowUpIcon />
                        </div>
                      ) : (
                        <div onClick={() => setCountryUp(!isCountryUp)}>
                          <ArrowDownIcon />
                        </div>
                      )}
                    </div>
                    {isCountryUp && (
                      <div className="grid grid-cols-2 2xl:grid-cols-3 gap-[10px] mt-8">
                        <button
                          onClick={() => handleClick("nigeria")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap  rounded-lg ${
                            selectedButton === "nigeria"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Nigeria
                        </button>
                        <button
                          onClick={() => handleClick("germany")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "germany"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Germany
                        </button>
                        <button
                          onClick={() => handleClick("usa")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "usa"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          U.S.A
                        </button>
                        <button
                          onClick={() => handleClick("uk")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "uk"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          U.K
                        </button>
                        <button
                          onClick={() => handleClick("ghana")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "ghana"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Ghana
                        </button>

                        <button
                          onClick={() => handleClick("canada")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "canada"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Canada
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 4th section */}
                  <div className="px-8 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">City</p>
                      {isCityUp ? (
                        <div onClick={() => setCityUp(!isCityUp)}>
                          <ArrowUpIcon />
                        </div>
                      ) : (
                        <div onClick={() => setCityUp(!isCityUp)}>
                          <ArrowDownIcon />
                        </div>
                      )}
                    </div>
                    {isCityUp && (
                      <div className="grid grid-cols-2 2xl:grid-cols-3 gap-[10px] mt-8">
                        <button
                          onClick={() => handleClick("lagos")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "lagos"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Lagos
                        </button>
                        <button
                          onClick={() => handleClick("abuja")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "abuja"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Abuja
                        </button>
                        <button
                          onClick={() => handleClick("enugu")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "enugu"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Enugu
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 5th section */}
                  <div className="px-8 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">Price Range</p>
                      {isPriceUp ? (
                        <div onClick={() => setPriceUp(!isPriceUp)}>
                          <ArrowUpIcon />
                        </div>
                      ) : (
                        <div onClick={() => setPriceUp(!isPriceUp)}>
                          <ArrowDownIcon />
                        </div>
                      )}
                    </div>
                    {isPriceUp && (
                      <div className="grid grid-cols-2 2xl:grid-cols-3 gap-[10px] mt-8">
                        <button
                          onClick={() => handleClick("free")}
                          className={`py-4 px-5 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "free"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Free
                        </button>
                        <button
                          onClick={() => handleClick("1-10")}
                          className={`py-4 px-5 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton === "1-10"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          1k -10k
                        </button>
                        <button
                          onClick={() => handleClick("10-50")}
                          className={`py-4 px-5 text-base border-[1px] border-gray-200 whitespace-nowrap  rounded-lg ${
                            selectedButton === "10-50"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          10k -50k
                        </button>
                        <button
                          onClick={() => handleClick("50-100")}
                          className={`py-4 px-5 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButton == "50-100"
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          50k - 100k
                        </button>
                      </div>
                    )}
                  </div>

                  <button className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] mx-3 px-5 rounded-md border border-white">
                    See more
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
