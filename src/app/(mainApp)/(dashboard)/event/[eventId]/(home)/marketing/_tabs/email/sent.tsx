import React, { useState, useEffect } from "react";
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

const Sent = () => {
  const { user, setUser } = useUserStore();

  if (!user) return;
  const { getMarketingEmails, marketingEmails, isLoading } =
    useGetMarketingEmails({ userId: user.id ?? 0 });

  

  const { filteredData, filters, selectedFilters, applyFilter, setOptions } =
    useFilter<TSentEmail>({
      data: marketingEmails || [],
      dataFilters: marketingEmailsFilter,
    });

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
    <section className="p-4 space-y-4">
      <Filter
        className={`space-y-4 max-w-full`}
        filters={filters.sort(
          (a, b) => (a.order || Infinity) - (b.order || Infinity)
        )}
        applyFilter={applyFilter}
        selectedFilters={selectedFilters}
      />
      <div className="space-y-2 w-full overflow-auto">
        <DataTable<TSentEmail>
          columns={columns}
          data={filteredData}
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
