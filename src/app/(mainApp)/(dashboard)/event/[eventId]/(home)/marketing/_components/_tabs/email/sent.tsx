"use client";
import React, { useState, useEffect, ReactNode, ReactNode } from "react";
import { TFilter } from "@/types/filter";
import { useGetMarketingEmails } from "@/hooks/services/marketing";
import { useFilter } from "@/hooks/common/useFilter";
import Filter from "@/components/Filter";
import { extractUniqueTypes } from "@/utils/helpers";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import { TSentEmail } from "@/types/marketing";
import { getCookie } from "@/hooks";
import { TUser } from "@/types";
import useUserStore from "@/store/globalUserStore";
import { Button, Input, ReactSelect } from "@/components";
import { cn } from "@/lib";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Check2 } from "styled-icons/bootstrap";
import { EyeIcon } from "lucide-react";
import { Envelope } from "styled-icons/fa-regular";
import useSearch from "@/hooks/common/useSearch";
import Link from "next/link";
import useEventStore from "@/store/globalEventStore";

const marketingEmailsFilter: TFilter<TSentEmail>[] = [
  {
    label: "Campaign name",
    accessor: "emailCategory",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth={0}
        viewBox="0 0 16 16"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M5 11.5a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zm0-4a.5.5 0 01.5-.5h9a.5.5 0 010 1h-9a.5.5 0 01-.5-.5zM3.854 2.146a.5.5 0 010 .708l-1.5 1.5a.5.5 0 01-.708 0l-.5-.5a.5.5 0 11.708-.708L2 3.293l1.146-1.147a.5.5 0 01.708 0zm0 4a.5.5 0 010 .708l-1.5 1.5a.5.5 0 01-.708 0l-.5-.5a.5.5 0 11.708-.708L2 7.293l1.146-1.147a.5.5 0 01.708 0zm0 4a.5.5 0 010 .708l-1.5 1.5a.5.5 0 01-.708 0l-.5-.5a.5.5 0 01.708-.708l.146.147 1.146-1.147a.5.5 0 01.708 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    optionsFromData: true,
    type: "multiple",
    order: 1,
  },
  {
    label: "Date",
    accessor: "created_at",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth={0}
        viewBox="0 0 16 16"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M14 0H2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V2a2 2 0 00-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M6.5 7a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm-9 3a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm-9 3a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    type: "dateRange",
    order: 2,
  },
  {
    label: "Sender",
    accessor: "sendersName",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth={0}
        viewBox="0 0 16 16"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002.002zM8 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    optionsFromData: true,
    type: "multiple",
    order: 3,
  },
  {
    label: "Recipients",
    accessor: "emailRecipient",
    icon: (
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth={0}
        viewBox="0 0 16 16"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002.002zM8 7a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    type: "range",
    order: 4,
    steps: 10,
    max: 500,
  },
];

export const EmailInfoCard = ({
  label,
  Icon,
  value,
  mutedText,
  description,
}: {
  Icon: (props: any) => React.JSX.Element;
  label: string;
  value: string | number;
  mutedText?: ReactNode;
  description?: string;
}) => {
  return (
    <div className="px-4 py-8 rounded-md bg-white border flex items-center border-basePrimary">
      <div className="flex-[70%] flex flex-col gap-2">
        <div className="flex flex-col">
          <h3 className="font-medium text-basePrimary capitalize">{label}</h3>
          {description && (
            <span className="text-xs text-gray-600 font-medium">
              {description}
            </span>
          )}
        </div>
        <div className="flex items-end gap-2">
          <h4 className="text-2xl font-medium text-gray-800">{value}</h4>
          {mutedText && (
            <span className="font-medium text-gray-500 capitalize">
              {mutedText}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center flex-[30%]">
        <div className="bg-basePrimary/20 p-4 rounded-full h-fit w-fit">
          <Icon className="h-10 w-10 text-basePrimary" />
        </div>
      </div>
    </div>
  );
};

const Sent = () => {
  const [category, setCategory] = useState<string>("all");
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const { user, setUser } = useUserStore();
  const { event } = useEventStore();

  if (!user) return;
  const { getMarketingEmails, marketingEmails, isLoading } =
    useGetMarketingEmails({
      userId: user.id ?? 0,
      eventAlias: event?.eventAlias,
    });

  const { filteredData, filters, selectedFilters, applyFilter, setOptions } =
    useFilter<TSentEmail>({
      data: marketingEmails || [],
      dataFilters: marketingEmailsFilter,
    });

  const { searchTerm, searchedData, setSearchTerm } = useSearch<TSentEmail>({
    data: filteredData || [],
    accessorKey: ["subject"],
  });

  const toggleShowFilter = () =>
    setShowFilter((prevShowFilter) => !prevShowFilter);

  useEffect(() => {
    if (isLoading || !marketingEmails) return;

    filters
      .filter((filter) => filter.optionsFromData)
      .forEach(({ accessor }) => {
        setOptions(
          accessor,
          extractUniqueTypes<TSentEmail>(marketingEmails, accessor)
        );
      });
  }, [isLoading]);

  return (
    <section className="w-full px-4 mx-auto  max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10">
      <div className="flex justify-between mb-8">
        <div className="flex flex-col gap-2">
          <label className="font-medium">Select Category</label>
          <Select
            name="category"
            defaultValue={category}
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={"Please select category"}
                className={cn("placeholder:text-sm w-full py-4")}
              />
            </SelectTrigger>
            <SelectContent className="max-h-[250px] hide-scrollbar overflow-auto">
              {["announcements", "reminders", "marketing", "all"].map(
                (category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="inline-flex gap-2 capitalize"
                  >
                    {category}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
        <Link href="email/create">
          <Button
            type="submit"
            className={cn(
              "text-white bg-basePrimary border border-basePrimary gap-x-2"
            )}
          >
            <span>Create</span>
            <Envelope className="h-5 w-5 text-white" />
          </Button>
        </Link>
      </div>
      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 items-center mb-8">
        <EmailInfoCard label="Sent Emails" value={1000} Icon={CalendarIcon} />
        <EmailInfoCard label="Delivered Emails" value={1000} Icon={Check2} />
        <EmailInfoCard label="Open Rate" value={"70% "} Icon={EyeIcon} />
      </div>
      <div className="space-y-4 w-full py-4 bg-transparent  rounded-md">
        <div className="flex gap-8 justify-center">
          <div className="relative w-fit">
            <svg
              className="absolute left-2 top-1/2 -translate-y-1/2 text-basePrimary stroke-basePrimary"
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M16.5 16.5L11.5 11.5M1.5 7.33333C1.5 8.09938 1.65088 8.85792 1.94404 9.56565C2.23719 10.2734 2.66687 10.9164 3.20854 11.4581C3.75022 11.9998 4.39328 12.4295 5.10101 12.7226C5.80875 13.0158 6.56729 13.1667 7.33333 13.1667C8.09938 13.1667 8.85792 13.0158 9.56565 12.7226C10.2734 12.4295 10.9164 11.9998 11.4581 11.4581C11.9998 10.9164 12.4295 10.2734 12.7226 9.56565C13.0158 8.85792 13.1667 8.09938 13.1667 7.33333C13.1667 6.56729 13.0158 5.80875 12.7226 5.10101C12.4295 4.39328 11.9998 3.75022 11.4581 3.20854C10.9164 2.66687 10.2734 2.23719 9.56565 1.94404C8.85792 1.65088 8.09938 1.5 7.33333 1.5C6.56729 1.5 5.80875 1.65088 5.10101 1.94404C4.39328 2.23719 3.75022 2.66687 3.20854 3.20854C2.66687 3.75022 2.23719 4.39328 1.94404 5.10101C1.65088 5.80875 1.5 6.56729 1.5 7.33333Z"
                stroke="#001FCC"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Input
              type="text"
              placeholder="Search by subject"
              value={searchTerm}
              disabled={isLoading}
              onInput={(event) => setSearchTerm(event.currentTarget.value)}
              className="border-basePrimary border placeholder:text-sm h-11 pl-8"
            />
          </div>
          <button className="flex flex-col gap-1" onClick={toggleShowFilter}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M1.5 6.75H22.5M5.25 12H18.75M9.75 17.25H14.25"
                stroke="#001FCC"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className=" text-tiny font-medium text-ash leading-[145%] ">
              {showFilter ? "Hide" : "Show"}
            </span>
          </button>
        </div>
        <Filter
          className={`transition-all duration-150 my-4 space-y-4 ${
            showFilter ? "h-fit" : "h-0 overflow-hidden"
          }`}
          filters={filters.sort(
            (a, b) => (a.order || Infinity) - (b.order || Infinity)
          )}
          applyFilter={applyFilter}
          selectedFilters={selectedFilters}
        />
      </div>
      <div className="space-y-2 w-full overflow-auto">
        <DataTable<TSentEmail>
          columns={columns}
          data={searchedData.filter(
            ({ emailCategory }) =>
              category === "all" || emailCategory === category
          )}
          rowStyle={{
            display: "grid",
            gridTemplateColumns: `1fr repeat(${
              columns.length - 1
            }, minmax(0, 1fr))`,
          }}
        />
      </div>
    </section>
  );
};

export default Sent;
