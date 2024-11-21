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
import { TEventTransactionDetail } from "@/types";

export default function AdminTransactions({
  searchParams: { e },
}: {
  searchParams: any;
}) {
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(50);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (e !== null) {
      setFrom(0);
      setTo(50);
    }
  }, [e]);

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

  const { searchTerm, searchedData, setSearchTerm } = useSearch<TEventTransactionDetail>({
    data: transactions || [],
    accessorKey: ["eventRegistrationRef", "event", "userEmail"],
  });

  return (
    <div className="w-full pt-12 sm:pt-16">
      <RouteHeader
        header="Event Transactions"
        description="All Events Transactions"
      />
      <div className="w-full flex items-end px-4 justify-end ">
        <div className="w-full sm:w-[350px] h-12 relative">
          <CiSearch className="absolute text-gray-300 left-2 top-3 text-[20px]"/>
          <input 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 text-mobile sm:text-sm outline-none border-b border-x-0 border-t-0 focus:border-b-basePrimary pl-10 placeholder:text-gray-300 pr-4 " placeholder="Search by Event ,Email, or Registration reference"/>
        </div>
      </div>
      <div className="w-full pt-6 px-4 sm:pt-18">
        <table className="w-full min-w-[1000px]  overflow-x-auto no-scrollbar">
          <thead className="w-full">
            <tr className="w-full p-4 font-medium bg-gray-100 gap-2 text-mobile sm:text-sm items-center rounded-t-lg grid grid-cols-11 ">
              <td className="">Date</td>
              <td className="col-span-2">Email</td>
              <td className="col-span-2">Event Name</td>
              <td>No of Attendees</td>
              <td className="">Amount Payable</td>
              <td className="">Amount Paid</td>
              <td>Reg. Ref.</td>
              <td>Email Sent</td>
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
