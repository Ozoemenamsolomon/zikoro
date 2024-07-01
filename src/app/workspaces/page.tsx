"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import CopyrightFooter from "@/components/CopyrightFooter";
import {
  FilterIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CloseIcon,
} from "@/constants/icons";
import { ArrowBackCircle } from "styled-icons/ionicons-outline";
import FeaturedEvent from "@/components/explore/FeaturedEvent";
import { useSearchParams } from "next/navigation";
import {
  startOfToday,
  endOfToday,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { ClipboardCode } from "styled-icons/fluentui-system-regular";
import toast from "react-hot-toast";
import OrganizationNavbar from "@/components/OrganizationNavbar";

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
  organisationId: number;
};

interface CategorizedButtons {
  locationType: string[];
  eventCountry: string[];
  eventCity: string[];
  eventCategory: string[];
  dateFilter: string[];
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

export default function Workspaces() {
  const [showMore, setShowMore] = useState(false);
  const params = useSearchParams();
  const query = params.get("query");
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
  const [isEventDateUp, setEventDateUp] = useState(false);
  const [isEventTypeUp, setEventTypeUp] = useState(false);
  const [isCountryUp, setCountryUp] = useState(false);
  const [isCityUp, setCityUp] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);
  const [eventData, setEventData] = useState<DBFeaturedEvent[] | undefined>(
    undefined
  );
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterLocationType, setFilterLocationType] = useState<string[]>([]);
  const [filterCountry, setFilterCountry] = useState<string[]>([]);
  const [filterCity, setFilterCity] = useState<string[]>([]);
  const [url, setUrl] = useState("");

  //see more function
  const handleSeeMoreClick = () => {
    setShowMore(true);
  };

  //clear filter button
  const clearFilterButton = () => {
    setSelectedButtons([]);
  };

  //copy page url
  const copyPageUrl = () => {
    const iFrameCode = `<iframe
      src="${url}"
      style={{width: '90%', height: '80%'}}
      title="Organization Page Preview"
      > 
    </iframe>`;

    navigator.clipboard
      .writeText(iFrameCode)
      .then(() => {
        toast("Code copied to clipboard!");
      })
      .catch((err: any) => {
        toast.error("Failed to copy: ", err);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    //fetch events from database
    async function fetchEventFeautured() {
      fetch("/api/explore/featured?query", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setEventData(data.data))
        .catch((error) => console.error("Error:", error));
    }

    //set profile Url to current page
    setUrl(window.location.href);

    //call the fetch event function
    fetchEventFeautured();
  }, []);

  useEffect(() => {
    if (query) {
      setSelectedButtons(query.split(","));
    }
  }, [query]);

  const getStartAndEndDates = (filterType: string): DateRange => {
    switch (filterType) {
      case "today":
        return { start: startOfToday(), end: endOfToday() };
      case "this-week":
        return { start: startOfWeek(new Date()), end: endOfWeek(new Date()) };
      case "this-month":
        return { start: startOfMonth(new Date()), end: endOfMonth(new Date()) };
      default:
        return { start: null, end: null };
    }
  };

  //button selection
  const handleButtonClick = (text: string) => {
    const isSelected = selectedButtons.includes(text);

    if (isSelected) {
      setSelectedButtons(selectedButtons.filter((button) => button !== text));
    } else {
      setSelectedButtons([...selectedButtons, text]);
    }
  };

  useEffect(() => {
    //fetching event categories
    if (eventData) {
      const categories: string[] = eventData.map(
        (event) => event.eventCategory
      );
      setFilterCategories(categories);
    }
    //fetching event location type
    if (eventData) {
      const filtertype: string[] = eventData.map((event) => event.locationType);
      setFilterLocationType(filtertype);
    }

    //fetching event country
    if (eventData) {
      const country: string[] = eventData.map((event) => event.eventCountry);
      setFilterCountry(country);
    }

    //fetching event city
    if (eventData) {
      const cities: string[] = eventData.map((event) => event.eventCity);
      setFilterCity(cities);
    }
  }, [eventData]);

  const categorizeButtons = (buttons: string[]): CategorizedButtons => {
    const categories: CategorizedButtons = {
      locationType: [],
      eventCountry: [],
      eventCity: [],
      eventCategory: [],
      dateFilter: [],
    };

    buttons.forEach((button) => {
      if (["today", "this-week", "this-month"].includes(button)) {
        categories.dateFilter.push(button);
      } else if (filterLocationType.includes(button)) {
        categories.locationType.push(button);
      } else if (filterCountry.includes(button)) {
        categories.eventCountry.push(button);
      } else if (filterCity.includes(button)) {
        categories.eventCity.push(button);
      } else if (filterCategories.includes(button)) {
        categories.eventCategory.push(button);
      }
    });

    return categories;
  };

  //filter function
  const filteredEvents = eventData
    ?.filter((event) => {
      const lowerSearchQuery = searchQuery?.toLowerCase();
      return (
        // event.eventTitle.toLowerCase().includes(lowerSearchQuery) ||
        // event.eventCity.toLowerCase().includes(lowerSearchQuery ?? "") ||
        // event.eventCategory.toLowerCase().includes(lowerSearchQuery ?? "")
        // event.organisationId.toString().includes(query ?? "")
        console.log(event)
      );
    })
    .filter((event) => {
      const categories = categorizeButtons(selectedButtons);

      if (
        Object.values(categories).every((category) => category.length === 0)
      ) {
        return true;
      }

      const eventProps = {
        locationType: event.locationType.toLowerCase(),
        eventCountry: event.eventCountry.toLowerCase(),
        eventCity: event.eventCity.toLowerCase(),
        eventCategory: event.eventCategory.toLowerCase(),
      };

      // Date filtering
      if (categories.dateFilter.length > 0) {
        const dateFilter = categories.dateFilter[0];
        const { start, end } = getStartAndEndDates(dateFilter);
        const eventDate = new Date(event.startDateTime);
        if (start && end && (eventDate < start || eventDate > end)) {
          return false;
        }
      }

      // If only one category is selected
      const selectedCategories = Object.entries(categories).filter(
        ([key, values]) => values.length > 0
      );
      if (selectedCategories.length === 1) {
        const [key, values] = selectedCategories[0];
        return values.some(
          (value: string) =>
            eventProps[key as keyof typeof eventProps] === value.toLowerCase()
        );
      }

      // If multiple categories are selected, apply AND logic for categories and OR logic within the same category
      return selectedCategories.every(([key, values]) => {
        return values.some(
          (value: string) =>
            eventProps[key as keyof typeof eventProps] === value.toLowerCase()
        );
      });
    });

  return (
    <>
      {eventData && eventData.length > 0 && (
        <div className="">
          {/* normal screen */}
          {!isFilterOpen && (
            <div>
              <OrganizationNavbar />
              {/* header */}
              <div>
                {/* big screen */}
                <div className="px-0 max-w-full lg:max-w-7xl mx-auto  lg:mt-28 hidden lg:block ">
                  {/* mt-12       */}

                  {/* main section */}
                  <div className="flex flex-col lg:flex-row justify-between mt-[50px] border-l-[1px] border-gray-200 rounded-none">
                    {/* left */}
                    <div className="border-t-[1px] border-gray-200 h-full pb-12 w-full lg:w-3/12 ">
                      <div className="flex py-[42px] px-[30px] border-b-[1px] border-gray-200 items-center justify-between">
                        <div className="flex gap-x-3 items-center ">
                          <FilterIcon />
                          <p className="text-xl font-semibold"> Filters</p>
                        </div>

                        <ClipboardCode
                          size={28}
                          className="cursor-pointer"
                          onClick={() => copyPageUrl()}
                        />
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
                              {filterLocationType
                                .filter(
                                  (locationType, index, self) =>
                                    self.indexOf(locationType) === index
                                )
                                .map((locationType) => (
                                  <button
                                    onClick={() =>
                                      handleButtonClick(locationType)
                                    }
                                    className={`py-3 px-2 text-[12px] border-[1px] border-gray-200  rounded-lg ${
                                      selectedButtons.includes(locationType)
                                        ? "bg-zikoroBlue text-white"
                                        : "bg-white text-black"
                                    }`}
                                  >
                                    {locationType}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>

                        {/* 2nd section */}
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
                              {filterCountry
                                .filter(
                                  (country, index, self) =>
                                    self.indexOf(country) === index
                                )
                                .slice(0, 4)
                                .map((country) => (
                                  <button
                                    onClick={() => handleButtonClick(country)}
                                    className={`py-3 px-2 text-[12px] border-[1px] border-gray-200  rounded-lg ${
                                      selectedButtons.includes(country)
                                        ? "bg-zikoroBlue text-white"
                                        : "bg-white text-black"
                                    }`}
                                  >
                                    {country}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>

                        {/* 3rd section */}
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
                              {filterCity
                                .filter(
                                  (city, index, self) =>
                                    self.indexOf(city) === index
                                )
                                .slice(0, 4)
                                .map((city) => (
                                  <button
                                    onClick={() => handleButtonClick(city)}
                                    className={`py-3 px-2 text-[12px] border-[1px] border-gray-200  rounded-lg ${
                                      selectedButtons.includes(city)
                                        ? "bg-zikoroBlue text-white"
                                        : "bg-white text-black"
                                    }`}
                                  >
                                    {city}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>

                        {/* 4th section */}
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
                                onClick={() => handleButtonClick("today")}
                                className={`py-3 px-2 text-[12px] border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButtons.includes("today")
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                Today
                              </button>
                              <button
                                onClick={() => handleButtonClick("this-week")}
                                className={`py-3 px-2 text-[12px] border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButtons.includes("this-week")
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                This Week
                              </button>
                              <button
                                onClick={() => handleButtonClick("this-month")}
                                className={`py-3 px-2 text-[12px] border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                                  selectedButtons.includes("this-month")
                                    ? "bg-zikoroBlue text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                This Month
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
                          {filterCategories
                            .filter(
                              (category, i, self) =>
                                self.indexOf(category) === i
                            )
                            .map((category) => (
                              <div
                                className={`py-[18px] px-5 w-auto cursor-pointer text-sm border-[1px] rounded-lg whitespace-nowrap ${
                                  selectedButtons.includes(category)
                                    ? "bg-zikoroBlue text-white"
                                    : "border-gray-200 bg-white text-black"
                                }`}
                                onClick={() => handleButtonClick(category)}
                              >
                                {category}
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
                  <div className="mt-12 ">
                    {/* <p className=" text-center text-[24px] gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end font-bold">
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
                    </div> */}

                    <div className="mt-7">
                      <div className=" px-4 flex w-auto items-center overflow-x-auto no-scrollbar py-7 gap-x-[10px] border-y-[1px] border-gray-200 ">
                        {filterCategories
                          .filter(
                            (category, i, self) => self.indexOf(category) === i
                          )
                          .map((category) => (
                            <div
                              className={`py-[18px] px-5 w-auto cursor-pointer text-sm border-[1px] rounded-lg whitespace-nowrap ${
                                selectedButtons.includes(category)
                                  ? "bg-zikoroBlue text-white"
                                  : "border-gray-200 bg-white text-black"
                              }`}
                              onClick={() => handleButtonClick(category)}
                            >
                              {category}
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

              <CopyrightFooter />
            </div>
          )}

          {/* Filter Screen */}
          {isFilterOpen && (
            <div className="block lg:hidden">
              <div className="flex py-6 px-5 items-center justify-between border-b-[1px] border-gray-300 ">
                <div className="flex gap-x-3 items-center">
                  <ArrowBackCircle onClick={() => setFilterOpen(false)} />
                  <p className="text-[14px] font-semibold  ">Filter Events</p>
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
                        {filterLocationType
                          .filter(
                            (locationType, index, self) =>
                              self.indexOf(locationType) === index
                          )
                          .map((locationType) => (
                            <button
                              onClick={() => handleButtonClick(locationType)}
                              className={`py-3 px-2 text-[12px] border-[1px] border-gray-200  rounded-lg ${
                                selectedButtons.includes(locationType)
                                  ? "bg-zikoroBlue text-white"
                                  : "bg-white text-black"
                              }`}
                            >
                              {locationType}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* 2nd section */}
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
                        {filterCountry
                          .filter(
                            (country, index, self) =>
                              self.indexOf(country) === index
                          )
                          .slice(0, 4)
                          .map((country) => (
                            <button
                              onClick={() => handleButtonClick(country)}
                              className={`py-3 px-2 text-[12px] border-[1px] border-gray-200  rounded-lg ${
                                selectedButtons.includes(country)
                                  ? "bg-zikoroBlue text-white"
                                  : "bg-white text-black"
                              }`}
                            >
                              {country}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* 3rd section */}
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
                        {filterCity
                          .filter(
                            (city, index, self) => self.indexOf(city) === index
                          )
                          .slice(0, 4)
                          .map((city) => (
                            <button
                              onClick={() => handleButtonClick(city)}
                              className={`py-3 px-2 text-[12px] border-[1px] border-gray-200  rounded-lg ${
                                selectedButtons.includes(city)
                                  ? "bg-zikoroBlue text-white"
                                  : "bg-white text-black"
                              }`}
                            >
                              {city}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* 4th section */}
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
                          onClick={() => handleButtonClick("today")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButtons.includes("today")
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          Today
                        </button>
                        <button
                          onClick={() => handleButtonClick("this-week")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButtons.includes("this-week")
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          This Week
                        </button>
                        <button
                          onClick={() => handleButtonClick("this-month")}
                          className={`py-3 px-4 text-base border-[1px] border-gray-200 whitespace-nowrap rounded-lg ${
                            selectedButtons.includes("this-month")
                              ? "bg-zikoroBlue text-white"
                              : "bg-white text-black"
                          }`}
                        >
                          This Month
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    className=" text-white text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] mx-3 px-5 rounded-md border border-white"
                    onClick={() => setFilterOpen(false)}
                  >
                    Save
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