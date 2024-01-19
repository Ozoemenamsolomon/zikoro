"use client";

import { Button, Footer } from "@/components";
import Image from "next/image";
import { DateRange } from "@styled-icons/material/DateRange";
import { LocationOn } from "@styled-icons/material-rounded/LocationOn";
import { AppTitle } from "@styled-icons/fluentui-system-regular/AppTitle";
import { useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { Event } from "@/types";
import _ from "lodash";
import { DropDownCards } from "..";
import { LoaderAlt } from "@styled-icons/boxicons-regular/LoaderAlt";
import { CloseOutline } from "@styled-icons/evaicons-outline/CloseOutline";
import "react-datepicker/dist/react-datepicker.css";
import { useEventFilterHook } from "@/context";
import { useGetPublishedEvents } from "../../../hooks/events/event.hook";

export function HeroLayout({
  children,
  publishedEvents,
  loadingNextPage,
  loading,
  isLastPage,
}: {
  publishedEvents: Event[] | null;
  children: React.ReactNode;
  loadingNextPage: boolean;
  loading: boolean;
  isLastPage: boolean;
}) {
  const [isLocationDropDown, setShowLocationDropDown] = useState(false);
  const [isTitleDropDown, setShowTitleDropDown] = useState(false);
  const [isDatePanel, setDatePanel] = useState(false);

  const {
    titles,
    handleSelectedLocations,
    clearDate,
    clearLocation,
    clearTitle,
    locations,
    startDate,
    pagination,
    endDate,
    setEndDate,
    setStartDate,
    handleSelectedTitles,
    loadMore,
  } = useEventFilterHook();

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  /// restructuring event locations
  function getEventLocations(events: Event[] | null) {
    const eventLocationMapping = events?.map(({ eventCity }) => {
      return { value: `${eventCity}` };
    });

    const uniqueEventLocations = _.uniqBy(eventLocationMapping, "value");

    return uniqueEventLocations;
  }
  /// restructuring event title
  function getEventTitles(events: Event[] | null) {
    const eventTitleMapping = events?.map(({ eventTitle }) => {
      return { value: eventTitle };
    });
    const uniqueEventTitles = _.uniqBy(eventTitleMapping, "value");

    return uniqueEventTitles;
  }

  const locationData = useMemo(
    () => getEventLocations(publishedEvents),
    [publishedEvents]
  );
  const titleData = useMemo(
    () => getEventTitles(publishedEvents),
    [publishedEvents]
  );

  return (
    <div className="w-full h-full relative bg-gray-50">
      <div className="w-full p-2 sm:p-4 relative h-[250px] md:h-[350px] bg-gray-50 ">
        <Image
          src="/images/zikoro.png"
          alt="zikoro"
          width={300}
          height={300}
          className="w-[150px] h-[40px]"
        />

        <div className=" h-fit w-fit absolute inset-0 m-auto">
          <div className="flex flex-col items-center gap-y-4 justify-center">
            <h2 className="text-2xl font-semibold sm:text-5xl ">
              Featured Events
            </h2>
            <div className="w-full bg-white mt-3 items-center grid grid-cols-3 justify-center h-14 py-2 rounded-lg border shadow sm:w-[600px]">
              <button
                onClick={() => setDatePanel((prev) => !prev)}
                className="flex relative hover:text-zikoro items-center w-full justify-center text-gray-400  gap-x-2"
              >
                <DateRange size={22} />
                <p>Date </p>
                {isDatePanel && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="absolute top-8 right-0"
                  >
                    <button
                      onClick={() => setDatePanel((prev) => !prev)}
                      className="w-full h-full inset-0 z-[100] "
                    ></button>
                    <div
                      role="button"
                      onClick={(e) => e.stopPropagation()}
                      className="relative z-[120]"
                    >
                      <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={onChange}
                        selectsRange
                        inline
                      />
                    </div>
                  </div>
                )}
              </button>
              <button
                onClick={() => setShowLocationDropDown((prev) => !prev)}
                className="flex relative items-center hover:text-zikoro w-full justify-center border-x px-4 text-gray-400  gap-x-2"
              >
                <LocationOn size={22} />
                <p>Location </p>
                {isLocationDropDown && (
                  <div className="absolute top-10 right-0">
                    <button className="w-full h-full fixed inset-0 z-[100]"></button>
                    <DropDownCards
                      data={locationData}
                      name="location"
                      selectedValues={locations}
                      handleRadioChange={handleSelectedLocations}
                    />
                  </div>
                )}
              </button>

              <button
                onClick={() => setShowTitleDropDown((prev) => !prev)}
                className="flex relative items-center hover:text-zikoro w-full justify-center text-gray-400  gap-x-2"
              >
                <AppTitle size={22} />
                <p>Title </p>
                {isTitleDropDown && (
                  <div className="absolute top-10 right-0">
                    <button className="w-full h-full fixed inset-0 z-[100]"></button>
                    <DropDownCards
                      data={titleData}
                      name="title"
                      selectedValues={titles}
                      handleRadioChange={handleSelectedTitles}
                    />
                  </div>
                )}
              </button>
            </div>
            {/** toClearFilterFields */}
            <div className="flex items-center mt-8 justify-center gap-x-3">
              {startDate && (
                <Button
                  onClick={clearDate}
                  className="gap-x-2 bg-blue-200 font-medium rounded-lg"
                >
                  <span>Date</span>
                  <CloseOutline size={22} />
                </Button>
              )}

              {locations.length > 0 && (
                <Button
                  onClick={clearLocation}
                  className="gap-x-2 bg-blue-200 font-medium rounded-lg"
                >
                  <span>Location</span>
                  <CloseOutline size={22} />
                </Button>
              )}

              {titles.length > 0 && (
                <Button
                  onClick={clearTitle}
                  className="gap-x-2 bg-blue-200  font-medium rounded-lg"
                >
                  <span>Title</span>
                  <CloseOutline size={22} />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="absolute top-[200px] md:top-[300px] bg-gray-50 w-full mx-auto">
          <div className="flex flex-col pb-20 sm:gap-y-6 gap-y-20 items-center mx-auto justify-center w-[95%] sm:w-[65%] lg:w-[80%] xl:w-[65%]">
            {children}
            { (!loading && !isLastPage) && (
              <Button
                onClick={() =>
                  loadMore(pagination.endIndex + 1, pagination.endIndex + 1)
                }
                disabled={loadingNextPage}
                className="w-fit rounded-sm mt-10 bg-transparent border hover:bg-zikoro gap-x-2 hover:text-gray-50 transition-all transform ease-in duration-300 border-zikoro text-zikoro  h-12"
              >
                {loadingNextPage && (
                  <LoaderAlt className="animate-spin" size={22} />
                )}
                <span>Load More Events</span>
              </Button>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
