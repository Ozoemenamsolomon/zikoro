"use client";

import { RouteHeader } from "../_components";
import { useState, useEffect } from "react";
import { formatDate } from "@/utils";
import { useGetAdminEventTransactions } from "@/hooks";
import { EventTransactionWidget } from "./_components";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { CiSearch } from "react-icons/ci";
import useSearch from "@/hooks/common/useSearch";
import { TEventTransactionDetail, TOrgEvent } from "@/types";
import { InlineIcon } from "@iconify/react";
import _ from "lodash";
import { usePostRequest } from "@/hooks/services/request";
import { MdClose } from "react-icons/md";
import { Pagination } from "@/components/custom_ui/Pagination";

function FilterMod({
  onSelected,
  close,
}: {
  onSelected: (i: { label: string; value: boolean; name: string }) => void;
  close: () => void;
}) {
  const filters = [
    {
      label: "Completed Registration",
      value: true,
      name: "registrationCompleted",
    },
    {
      label: "InComplete Registration",
      value: false,
      name: "registrationCompleted",
    },
    { label: "Sent Email", value: true, name: "emailSent" },
    { label: "Not Sent Email", value: false, name: "emailSent" },
  ];
  return (
    <div className="absolute top-[2.8rem] -left-4">
      <div onClick={close} className="w-full h-full inset-0 fixed z-40 "></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-50 flex flex-col items-start justify-start w-[200px] bg-white rounded-lg py-4 text-mobile sm:text-sm"
      >
        {filters?.map((v) => (
          <button
            onClick={() => {
              onSelected(v);
            }}
            className="w-full hover:bg-gray-200 text-start px-3 py-2"
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
  // const [initialLoading, setInitialLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<Transactions[]>([]);
  const [isFilter, setOpenFilterModal] = useState(false);
  const [transactionIds, setTransactionIds] = useState<number[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<
    { label: string; value: boolean; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { postData } = usePostRequest("/payment/resend");

  useEffect(() => {
    if (e !== null) {
      setFrom(0);
      setTo(50);
    }
  }, [e]);

  function onToggle() {
    setOpenFilterModal((p) => !p);
  }

  const {
    hasReachedLastPage,
    getTransactions,
    transactions,
    isLoading,
    total,
  } = useGetAdminEventTransactions({
    eventAlias: e,
    from,
    to,
  });

  // const { ref: infiniteScrollRef } = useInfiniteScrollPagination(
  //   hasReachedLastPage,
  //   setFrom,
  //   setTo,
  //   setInitialLoading
  // );

  useEffect(() => {
    if (Array.isArray(transactions)) {
      const filtered = transactions.filter((transaction) => {
        if (selectedOptions.length === 0) return true;

        return selectedOptions.every((option) => {
          return (
            transaction[option.name as keyof Transactions] === option.value
          );
        });
      });
      setFilteredData(filtered);
      // console.log("dfwfwefwe", filtered);
      setTransactionIds([]);
    }
  }, [transactions, selectedOptions]);

  const { searchTerm, searchedData, setSearchTerm } = useSearch<Transactions>({
    data: filteredData || [],
    accessorKey: ["eventRegistrationRef", "event", "userEmail"],
  });

  function onSelected(val: { label: string; value: boolean; name: string }) {
    setSelectedOptions((prev) => {
      const filtered = prev.filter((option) => option.name !== val.name);

      const updatedOptions = [...filtered, val];

      return updatedOptions.slice(-2);
    });
    onToggle();
  }

  async function sendBulkMail() {
    try {
      const filteredTransactions = transactions?.filter((value) => {
        return transactionIds.includes(value.id);
      });

      setLoading(true);
      for (let transaction of filteredTransactions) {
        const payload = {
          eventId: transaction?.eventId,
          eventAlias: transaction?.eventAlias,
          eventImage: transaction?.eventData?.eventPoster,
          eventRegistrationRef: transaction?.eventRegistrationRef,
          amountPaid: transaction?.amountPaid,
          attendees: transaction?.attendees,
          discountValue: transaction?.discountValue,
          referralSource: transaction?.referralSource,
          discountCode: transaction?.discountCode,
          amountPayable: transaction?.amountPayable,

          address: transaction?.eventData?.eventAddress,
          count: transaction?.attendees,
          currency: transaction?.currency,
          organizerContact: {
            email: transaction?.eventData?.organization?.eventContactEmail,

            phoneNumber: transaction?.eventData?.organization?.eventPhoneNumber,
            whatsappNumber: transaction?.eventData?.organization?.eventWhatsApp,
          },
          organization: transaction?.eventData?.organization?.organizationName,
          startDate: formatDate(transaction?.eventData?.startDateTime),
          endDate: formatDate(transaction?.eventData?.endDateTime),
          paymentDate: transaction?.paymentDate,
          eventDate: transaction?.eventDate,
          eventEndDate: transaction?.eventData?.endDateTime,
          event: transaction?.event,
          attendeesDetails: transaction?.attendeesDetails,
          eventPrice: transaction?.eventPrice,
          originalEvent: transaction?.eventData,
        };

        await postData({ payload });
        getTransactions();
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function updateTransactionIds(id: number) {
    if (transactionIds.some((i) => i === id)) {
      setTransactionIds(transactionIds.filter((t) => t !== id));
    } else {
      setTransactionIds((prev) => [...prev, id]);
    }
  }

  function changePage(n: number) {
    // 1 * 50 // 1 * 50 -50
    // 2 * 50 // 2 * 50 - 50
    // 3 & 50 // 3 * 50 -50
    // 4 & 50 //
   // console.log("number of page", n);
    setFrom(n * 50 - 50);
    setTo(n * 50);
  }
  return (
    <div className="w-full pt-12 sm:pt-16">
      <RouteHeader
        header="Event Transactions"
        description="All Events Transactions"
      />
      <div className="w-full flex sm:flex-row-reverse flex-col gap-4 items-start  sm:items-center px-4 justify-start sm:justify-between ">
        <div className="w-full sm:w-fit flex flex-col gap-4 items-start justify-start sm:flex-row sm:items-center">
          <button
            onClick={onToggle}
            className=" flex items-center relative  px-4 h-11"
          >
            <InlineIcon
              icon="lets-icons:filter-alt-duotone-line"
              fontSize={22}
            />
            <p className="text-sm hidden sm:block">Filter</p>
            {isFilter && <FilterMod close={onToggle} onSelected={onSelected} />}
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
       
        {/**visible when length od selectedid is greater than zero */}
        {transactionIds?.length > 0 && (
          <button
            disabled={loading}
            onClick={sendBulkMail}
            className="rounded-md flex items-center gap-x-2 bg-gray-100 font-medium px-4 h-11"
          >
            <InlineIcon icon="ic:twotone-email" color="#262424" fontSize={22} />
            <span> Send Bulk Mail</span>
            {loading && (
              <LoaderAlt className="text-gray-400 animate-spin" size={20} />
            )}
          </button>
        )}
      </div>
      <div className="flex  justify-center my-4 items-center gap-x-2">
          {selectedOptions?.length > 0 &&
            selectedOptions?.map((v) => (
              <button
                onClick={() =>
                  setSelectedOptions(
                    selectedOptions?.filter((val) => val?.name !== v?.name)
                  )
                }
                className="flex text-mobile sm:text-sm bg-[#001fcc]/30 p-2 items-center gap-x-2"
              >
                {v?.label} <MdClose size={20} className="text-[#001fcc]" />
              </button>
            ))}
        </div>
      <div className="w-full pt-6 px-4 sm:pt-18">
        <table className="w-full min-w-[1000px]  overflow-x-auto no-scrollbar">
          <thead className="w-full">
            <tr className="w-full p-4 font-medium bg-gray-100 gap-2 text-mobile sm:text-sm items-center rounded-t-lg grid grid-cols-9 ">
              <td className="">Date</td>
              <td>Reg. Ref.</td>
              <td className="col-span-2">Event Name</td>
              <td>No of Attendees</td>

              <td className="">Amount Paid</td>

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
                <tr className="w-full">
                  <EventTransactionWidget
                    updateTransactionIds={updateTransactionIds}
                    transactionIds={transactionIds}
                    transaction={transaction}
                    getTransactions={getTransactions}
                  />
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Pagination totalPages={total} setPage={changePage} />
    </div>
  );
}
