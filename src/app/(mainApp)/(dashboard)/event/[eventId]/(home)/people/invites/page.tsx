"use client";
import { DataTable } from "@/components/DataTable";
import Filter from "@/components/Filter";
import { Button } from "@/components/ui/button";
import { useFilter, useGetEmailInvites } from "@/hooks";
import useEventStore from "@/store/globalEventStore";
import { TAttendeeInvites, TFilter } from "@/types";
import { RowSelectionState } from "@tanstack/react-table";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import { extractUniqueTypes } from "@/utils/helpers";
import useSearch from "@/hooks/common/useSearch";
import { Input } from "@/components/ui/input";

const InvitesFilter: TFilter<TAttendeeInvites>[] = [
  {
    label: "role",
    accessor: "role",
    optionsFromData: true,
    type: "multiple",
    order: 1,
  },
  {
    label: "method",
    accessor: "method",
    optionsFromData: true,
    type: "single",
    order: 2,
  },
  {
    label: "First Invite",
    accessor: "created_at",
    type: "dateRange",
    order: 3,
  },
  {
    label: "status",
    accessor: "response",
    type: "multiple",
    order: 4,
  },
];

const page = () => {
  const router = useRouter();
  const { eventId } = useParams();
  const { event } = useEventStore();
  if (!event) return;

  const { emailInvites, isLoading, getEmailInvites } = useGetEmailInvites({
    eventId: eventId,
  });

  console.log(emailInvites);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // const { searchTerm, searchedData, setSearchTerm } =
  //   useSearch<TAttendeeInvites>({
  //     data: emailInvites || [],
  //     accessorKey: ["email", "name"],
  //   });

  const { filteredData, filters, selectedFilters, applyFilter, setOptions } =
    useFilter<TAttendeeInvites>({
      data: emailInvites ?? [],
      dataFilters: InvitesFilter,
    });

  useEffect(() => {
    if (isLoading) return;

    filters
      .filter((filter) => filter.optionsFromData)
      .forEach(({ accessor }) => {
        setOptions(
          accessor,
          extractUniqueTypes<TAttendeeInvites>(emailInvites, accessor)
        );
      });
  }, [isLoading]);
  // }, []);

  const StatCard = ({ title, count }: { title: string; count: number }) => {
    return (
      <div className="bg-basePrimary h-[100px] flex items-center justify-center p-0.5 rounded-md">
        <div className="bg-white p-2 flex flex-col justify-between h-full rounded-md w-full">
          <span className="text-lg font-medium text-basePrimary">{title}</span>
          <span className="text-gray-800 font-semibold text-4xl">{count}</span>
        </div>
      </div>
    );
  };

  const totalInvitees = emailInvites.length;
  const attending = emailInvites.filter(
    ({ response }) => response === "attending"
  ).length;
  const notAttending = emailInvites.filter(
    ({ response }) => response === "not attending"
  ).length;
  const awaitingResponse = emailInvites.filter(
    ({ response }) => response === "pending"
  ).length;

  const refreshableColumns = columns(getEmailInvites);
  return (
    <section className="space-y-8 pl-4 pr-8 bg-[#f9faff] py-8 min-h-full">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Invite Analytics
          </h1>
          <Button
            onClick={() => router.push("invites/send")}
            className="bg-basePrimary flex gap-2 px-2 text-white"
          >
            <span className="font-medium">Invite</span>
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth={2}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </Button>
        </div>
        <div className="grid grid-cols-5 gap-6 items-center">
          <StatCard title="Total Invitees" count={totalInvitees} />
          <StatCard title="Attending" count={attending} />
          <StatCard title="Not Attending" count={notAttending} />
          <StatCard title="Awaiting Response" count={awaitingResponse} />
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Invite Sent</h2>

        <div className="space-y-2">
          <div className="relative">
            <div className="absolute !my-0 left-2 z-10 h-full flex items-center">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10,18c1.846,0,3.543-0.635,4.897-1.688l4.396,4.396l1.414-1.414l-4.396-4.396C17.365,13.543,18,11.846,18,10 c0-4.411-3.589-8-8-8s-8,3.589-8,8S5.589,18,10,18z M10,4c3.309,0,6,2.691,6,6s-2.691,6-6,6s-6-2.691-6-6S6.691,4,10,4z" />
              </svg>
            </div>
            {/* <Input
              type="text"
              placeholder="Search by email"
              value={searchTerm}
              disabled={isLoading}
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 bg-gray-50 rounded-2xl pl-8 w-full"
            /> */}
          </div>
          <Filter
            className={`space-y-4 max-w-full overflow-auto hide-scrollbar`}
            filters={filters.sort(
              (a, b) => (a.order || Infinity) - (b.order || Infinity)
            )}
            applyFilter={applyFilter}
            selectedFilters={selectedFilters}
          />
          <div className="space-y-2 max-w-full overflow-auto">
            <DataTable<TAttendeeInvites>
              columns={refreshableColumns}
              data={filteredData}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              canSelectRow={(row) => row?.original?.response === "pending"}
              rowStyle={{
                display: "grid",
                gridTemplateColumns: `auto 1.5fr repeat(${
                  refreshableColumns.length - 2
                }, minmax(0, 1fr))`,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
