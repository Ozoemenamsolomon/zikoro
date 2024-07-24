"use client";
import { DataTable } from "@/components/DataTable";
import Filter from "@/components/Filter";
import { Button } from "@/components/ui/button";
import { useFilter, useGetEmailInvites } from "@/hooks";
import useEventStore from "@/store/globalEventStore";
import { TAttendeeInvites, TFilter } from "@/types";
import { RowSelectionState } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import { extractUniqueTypes } from "@/utils/helpers";

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
    label: "date",
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

const DUMMY_DATA: TAttendeeInvites[] = [
  {
    id: 1,
    created_at: "2024-07-23T09:27:00Z",
    eventAlias: "event-123",
    name: "John Doe",
    email: "john.doe@example.com",
    response: "pending",
    trackingId: "track-001",
    role: "speaker",
    method: "email",
  },
  {
    id: 2,
    created_at: "2024-07-23T09:30:00Z",
    eventAlias: "event-123",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    response: "attending",
    trackingId: "track-002",
    role: "attendee",
    method: "email",
  },
  {
    id: 3,
    created_at: "2024-07-23T09:35:00Z",
    eventAlias: "event-123",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    response: "not attending",
    trackingId: "track-003",
    role: "organizer",
    method: "email",
  },
  {
    id: 4,
    created_at: "2024-07-23T09:40:00Z",
    eventAlias: "event-124",
    name: "Bob Brown",
    email: "bob.brown@example.com",
    response: "attending",
    trackingId: "track-004",
    role: "attendee",
    method: "sms",
  },
  {
    id: 5,
    created_at: "2024-07-23T09:45:00Z",
    eventAlias: "event-124",
    name: "Charlie White",
    email: "charlie.white@example.com",
    response: "pending",
    trackingId: "track-005",
    role: "speaker",
    method: "email",
  },
  {
    id: 6,
    created_at: "2024-07-23T09:50:00Z",
    eventAlias: "event-125",
    name: "Diana Green",
    email: "diana.green@example.com",
    response: "attending",
    trackingId: "track-006",
    role: "attendee",
    method: "sms",
  },
];

const page = () => {
  const { filteredData, filters, selectedFilters, applyFilter, setOptions } =
    useFilter<TAttendeeInvites>({
      data: DUMMY_DATA,
      dataFilters: InvitesFilter,
    });
  const { eventId } = useParams();
  const { event } = useEventStore();
  // if (!event) return;

  // const { emailInvites, isLoading, getEmailInvites } = useGetEmailInvites({
  //   eventId: event.id,
  // });

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  useEffect(() => {
    // if (isLoading) return;

    filters
      .filter((filter) => filter.optionsFromData)
      .forEach(({ accessor }) => {
        setOptions(
          accessor,
          extractUniqueTypes<TAttendeeInvites>(DUMMY_DATA, accessor)
        );
      });
    // }, [isLoading]);
  }, []);

  return (
    <section className="space-y-8 pl-4 pr-8 bg-[#f9faff] py-8 min-h-full">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Invite Analytics
          </h1>
          <Button className="bg-basePrimary flex gap-2 px-2 text-white">
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
          <div className="bg-basePrimary h-[100px] flex items-center justify-center p-1  rounded-md">
            <div className="bg-white p-2 flex flex-col justify-between h-full rounded-md w-full">
              <span className="text-lg font-medium text-basePrimary">
                Total Invitees
              </span>
              <span className="text-gray-800 font-medium text-lg">1000</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Invite Sent</h2>

        <div className="space-y-2">
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
              columns={columns}
              data={filteredData}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              canSelectRow={(row) => row?.original?.response === "pending"}
              rowStyle={{
                display: "grid",
                gridTemplateColumns: `auto 1.5fr repeat(${
                  columns.length - 2
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
