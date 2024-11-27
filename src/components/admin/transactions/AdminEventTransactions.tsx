"use client";

import { RouteHeader } from "../_components";
import { useState, useEffect } from "react";
import {
  useGetAdminEventTransactions,
  useInfiniteScrollPagination,
} from "@/hooks";
import { EventTransactionWidget } from "./_components";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { CiSearch } from "react-icons/ci";
import useSearch from "@/hooks/common/useSearch";
import { TEventTransactionDetail, TOrgEvent } from "@/types";
import { InlineIcon } from "@iconify/react";
import _ from "lodash";


function FilterMod({
  onSelected,
  close
}: {
  onSelected: (i: { label: string; value: boolean; name:string }) => void;
  close: () => void;
}) {
  const filters = [
    { label: "Completed Registration", value: true, name:"eventRegistrationRef" },
    { label: "Completed Registration", value: false,  name:"eventRegistrationRef" },
    { label: "Sent Email", value: true, name:"emailSent" },
    { label: "Not Sent Email", value: false, name:"emailSent" },
  ];
  return (
    <div className="absolute top-[2.8rem] -left-4">
      <div
      onClick={close}
      className="w-full h-full inset-0 fixed z-[100] "></div>
      <div 
      onClick={(e) => e.stopPropagation()}
      className="relative z-[150] flex flex-col items-start w-[180px] bg-white rounded-lg py-4 text-mobile sm:text-sm">
        {filters?.map((v) => (
          <button
            onClick={() => {
              onSelected(v);
              close()
            }}
            className="w-full px-3 py-2"
          >
            {v?.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface Transactions extends TEventTransactionDetail {
  eventData: TOrgEvent;
}

export default function AdminTransactions({
  searchParams: { e },
}: {
  searchParams: any;
}) {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(50);
  const [initialLoading, setInitialLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([])
  const [isFilter, setOpenFilterModal] = useState(false)
  const [selectedOptions, setSelectedOptions] = useState<{label:string; value:boolean; name:string;}[]>([])

  useEffect(() => {
    if (e !== null) {
      setFrom(0);
      setTo(50);
    }
  }, [e]);

  function onToggle() {
    setOpenFilterModal((p) => !p)
  }

  const { hasReachedLastPage, getTransactions, transactions, isLoading } =
    useGetAdminEventTransactions({
      eventAlias: e,
      from,
      to,
      initialLoading,
    });

  const { ref: infiniteScrollRef } = useInfiniteScrollPagination(
    hasReachedLastPage,
    setFrom,
    setTo,
    setInitialLoading
  );


  useEffect(() => {
    if (Array.isArray(transactions)) {
     const filtered = transactions?.filter((value) => {

      return 
     }) 
    }

  },[transactions])

  const { searchTerm, searchedData, setSearchTerm } = useSearch<Transactions>({
    data: filteredData || [],
    accessorKey: ["eventRegistrationRef", "event", "userEmail"],
  });

  function onSelected(val:{label:string; value:boolean; name:string;}) {
    setSelectedOptions((prev) =>  _.uniqBy( [...prev, val], "name"))
  }



  return (
    <div className="w-full pt-12 sm:pt-16">
      <RouteHeader
        header="Event Transactions"
        description="All Events Transactions"
      />
      <div className="w-full flex sm:flex-row flex-col gap-4 items-start  sm:items-end px-4 justify-start sm:justify-end ">
        <button 
        onClick={onToggle}
        className=" flex items-center relative  px-4 h-11">
          <InlineIcon icon="lets-icons:filter-alt-duotone-line" fontSize={22} />
          <p className="text-sm hidden sm:block">Filter</p>
          {isFilter && <FilterMod close={onToggle} onSelected={onSelected}/>}
        </button>
        <div className="w-[85%] sm:w-[350px] h-12 relative">
          <CiSearch className="absolute text-gray-300 left-2 top-3 text-[20px]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 text-mobile sm:text-sm outline-none border-b border-x-0 border-t-0 focus:border-b-basePrimary pl-10 placeholder:text-gray-300 pr-4 "
            placeholder="Search by Event ,Email, or Registration reference"
          />
        </div>
      </div>
      <div className="w-full pt-6 px-4 sm:pt-18">
        <table className="w-full min-w-[1000px]  overflow-x-auto no-scrollbar">
          <thead className="w-full">
            <tr className="w-full p-4 font-medium bg-gray-100 gap-2 text-mobile sm:text-sm items-center rounded-t-lg grid grid-cols-12 ">
              <td className="">Date</td>
              <td className="col-span-2">RegisteredBy</td>
              <td className="col-span-2">Event Name</td>
              <td>No of Attendees</td>
              <td className="">Amount Payable</td>
              <td className="">Amount Paid</td>
              <td>Reg. Ref.</td>
              <td>Email Sent</td>
              <td>Reg. Completed</td>
              <td>Action</td>
            </tr>
          </thead>
          <tbody className="w-full bg-white text-mobile sm:text-sm">
            {isLoading && (
              <tr className="w-full h-[300px] flex items-center justify-center">
                <LoaderAlt size={30} className="animate-spin" />
              </tr>
            )}
            {!isLoading &&
              Array.isArray(searchedData) &&
              searchedData?.length === 0 && (
                <tr className="w-full flex items-center justify-center h-[250px]">
                  {" "}
                  <td className="font-semibold">No Data</td>
                </tr>
              )}
            {!isLoading &&
              Array.isArray(searchedData) &&
              searchedData?.map((transaction) => (
                <tr
                  ref={!hasReachedLastPage ? infiniteScrollRef : null}
                  className="w-full"
                >
                  <EventTransactionWidget transaction={transaction} />
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
