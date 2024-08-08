"use client"

import {
  createContext,
  SetStateAction,
  useState,
  useContext,
  useMemo,
} from "react";

type PaginationType = {
  startIndex: number;
  endIndex: number;
};
type EventsFilterContextType = {
  titles: string[];
  handleSelectedLocations: (value: string) => void;
  locations: string[];
  handleSelectedTitles: (value: string) => void;
  clearDate: () => void;
  startDate: Date | null;
  endDate: Date | null;
  pagination: PaginationType;
  clearTitle: () => void;
  clearLocation: () => void;
  loadMore:(start:number, end:number) => void
  setStartDate: (value: SetStateAction<Date | null>) => void;
  setEndDate: (value: SetStateAction<Date | null>) => void;
};
export const EventsFilterContext = createContext<EventsFilterContextType>(
  {} as EventsFilterContextType
);


let futureTimestamp = new Date().getTime() + (100 * 365 * 24 * 60 * 60 * 1000);

// Format the future date as a string in the same format as new Date()
let formattedFutureDate = new Date(futureTimestamp)

export function EventsFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locations, selectedLocations] = useState<string[]>([]);
  const [titles, selectedTitles] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(new Date()); // initial start date is Today
  const [endDate, setEndDate] = useState<Date | null>(formattedFutureDate); // initial end start Date is future date
  const [pagination, setPagination] = useState({ startIndex: 0, endIndex: 1 });

  const handleSelectedLocations = (value: string) => {
    const isValueSelected = locations.includes(value);
    

    selectedLocations((prevSelectedValues) => {
      if (isValueSelected) {
        return prevSelectedValues.filter(
          (selectedValue) => selectedValue !== value
        );
      } else {
        return [...prevSelectedValues, value];
      }
    });
    //  setShowLocationDropDown((prev) => !prev);
  };

  const handleSelectedTitles = (value: string) => {
    const isValueSelected = titles.includes(value);

    selectedTitles((prevSelectedValues) => {
      if (isValueSelected) {
        return prevSelectedValues.filter(
          (selectedValue) => selectedValue !== value
        );
      } else {
        return [...prevSelectedValues, value];
      }
    });
    //  setShowTitleDropDown((prev) => !prev);
  };

  // pagination
  function loadMore(start: number, end: number) {
    setPagination({ startIndex: start, endIndex: end });
  }

  // reset filter functions

  function clearDate() {
    setStartDate(null);
    setEndDate(null);
  }

  function clearLocation() {
    selectedLocations([]);
  }

  function clearTitle() {
    selectedTitles([]);
  }

  // memoized to avoid re-rendering
  const contextValue = useMemo(() => {
    return {
      titles,
      handleSelectedLocations,
      clearDate,
      clearLocation,
      clearTitle,
      pagination,
      locations,
      startDate,
      loadMore,
      endDate,
      setEndDate,
      setStartDate,
      handleSelectedTitles,
    };
  }, [
    titles,
    clearDate,
    clearLocation,
    startDate,
    setStartDate,
    pagination,
    loadMore,
    clearTitle,
    handleSelectedLocations,
    locations,
    handleSelectedTitles,
  ]);

  return (
    <EventsFilterContext.Provider value={contextValue}>
      {children}
    </EventsFilterContext.Provider>
  );
}

export const useEventFilterHook = () => {
  const context = useContext(EventsFilterContext);
  if (!context) {
    throw new Error(
      "useEventFilterHook must be used within an EventFilterProvider"
    );
  }
  return context;
};
