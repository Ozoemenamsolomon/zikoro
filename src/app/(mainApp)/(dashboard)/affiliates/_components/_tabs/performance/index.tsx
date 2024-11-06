import React, { useState, useEffect } from "react";
import { TFilter } from "@/types/filter";
import {
  useGetAffiliateLinks,
  useGetMarketingEmails,
} from "@/hooks/services/marketing";
import { useFilter } from "@/hooks/common/useFilter";
import Filter from "@/components/Filter";
import { extractUniqueTypes } from "@/utils/helpers";
import { DataTable } from "@/components/DataTable";
import { TAffiliateLink } from "@/types/marketing";
import { columns } from "./columns";
import { RowSelectionState } from "@tanstack/react-table";
import { TEventTransaction } from "@/types/billing";
import { getCookie } from "@/hooks";
import { TUser } from "@/types";
import useUserStore from "@/store/globalUserStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const affiliateLinkFilter: TFilter<TAffiliateLink>[] = [
  {
    label: "Affiliates",
    accessor: "affiliate",
    icon: (
      <svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.99984 8.33464C11.8408 8.33464 13.3332 6.84225 13.3332 5.0013C13.3332 3.16035 11.8408 1.66797 9.99984 1.66797C8.15889 1.66797 6.6665 3.16035 6.6665 5.0013C6.6665 6.84225 8.15889 8.33464 9.99984 8.33464Z"
          stroke="#D6D6D6"
          strokeWidth="1.5"
        />
        <path
          d="M16.6663 14.5859C16.6663 16.6568 16.6663 18.3359 9.99967 18.3359C3.33301 18.3359 3.33301 16.6568 3.33301 14.5859C3.33301 12.5151 6.31801 10.8359 9.99967 10.8359C13.6813 10.8359 16.6663 12.5151 16.6663 14.5859Z"
          stroke="#D6D6D6"
          strokeWidth="1.5"
        />
      </svg>
    ),
    optionsFromData: true,
    type: "multiple",
    order: 1,
  },
  {
    label: "Created Date",
    accessor: "created_at",
    icon: (
      <svg
        width={25}
        height={24}
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.19873 11H7.19873V13H9.19873V11ZM13.1987 11H11.1987V13H13.1987V11ZM17.1987 11H15.1987V13H17.1987V11ZM19.1987 4H18.1987V2H16.1987V4H8.19873V2H6.19873V4H5.19873C4.08873 4 3.20873 4.9 3.20873 6L3.19873 20C3.19873 20.5304 3.40944 21.0391 3.78452 21.4142C4.15959 21.7893 4.6683 22 5.19873 22H19.1987C20.2987 22 21.1987 21.1 21.1987 20V6C21.1987 4.9 20.2987 4 19.1987 4ZM19.1987 20H5.19873V9H19.1987V20Z"
          fill="#D6D6D6"
        />
      </svg>
    ),
    type: "dateRange",
    order: 2,
  },
  {
    label: "Validity",
    accessor: "validity",
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
    type: "dateRange",
    order: 3,
  },
  {
    label: "Commission Type",
    accessor: "commissionType",
    icon: (
      <svg
        width={25}
        height={24}
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.0957 7C6.0957 6.33696 6.3591 5.70107 6.82794 5.23223C7.29678 4.76339 7.93266 4.5 8.5957 4.5C9.25874 4.5 9.89463 4.76339 10.3635 5.23223C10.8323 5.70107 11.0957 6.33696 11.0957 7C11.0957 7.66304 10.8323 8.29893 10.3635 8.76777C9.89463 9.23661 9.25874 9.5 8.5957 9.5C7.93266 9.5 7.29678 9.23661 6.82794 8.76777C6.3591 8.29893 6.0957 7.66304 6.0957 7ZM8.5957 3C7.53484 3 6.51742 3.42143 5.76728 4.17157C5.01713 4.92172 4.5957 5.93913 4.5957 7C4.5957 8.06087 5.01713 9.07828 5.76728 9.82843C6.51742 10.5786 7.53484 11 8.5957 11C9.65657 11 10.674 10.5786 11.4241 9.82843C12.1743 9.07828 12.5957 8.06087 12.5957 7C12.5957 5.93913 12.1743 4.92172 11.4241 4.17157C10.674 3.42143 9.65657 3 8.5957 3ZM16.0957 8C16.0957 7.60218 16.2537 7.22064 16.535 6.93934C16.8163 6.65804 17.1979 6.5 17.5957 6.5C17.9935 6.5 18.3751 6.65804 18.6564 6.93934C18.9377 7.22064 19.0957 7.60218 19.0957 8C19.0957 8.39782 18.9377 8.77936 18.6564 9.06066C18.3751 9.34196 17.9935 9.5 17.5957 9.5C17.1979 9.5 16.8163 9.34196 16.535 9.06066C16.2537 8.77936 16.0957 8.39782 16.0957 8ZM17.5957 5C16.8001 5 16.037 5.31607 15.4744 5.87868C14.9118 6.44129 14.5957 7.20435 14.5957 8C14.5957 8.79565 14.9118 9.55871 15.4744 10.1213C16.037 10.6839 16.8001 11 17.5957 11C18.3914 11 19.1544 10.6839 19.717 10.1213C20.2796 9.55871 20.5957 8.79565 20.5957 8C20.5957 7.20435 20.2796 6.44129 19.717 5.87868C19.1544 5.31607 18.3914 5 17.5957 5ZM12.3457 13C12.6467 13 12.9337 13.06 13.1967 13.166C12.888 13.2855 12.606 13.4648 12.3669 13.6938C12.1278 13.9227 11.9364 14.1967 11.8037 14.5H4.8457C4.64679 14.5 4.45603 14.579 4.31537 14.7197C4.17472 14.8603 4.0957 15.0511 4.0957 15.25V15.507L4.1027 15.587C4.1097 15.661 4.1257 15.775 4.1577 15.916C4.2237 16.197 4.3557 16.572 4.6167 16.945C5.1097 17.65 6.1737 18.5 8.5957 18.5C10.0027 18.5 10.9507 18.213 11.5957 17.835V19.496C10.8047 19.808 9.8187 20 8.5957 20C5.7677 20 4.2057 18.975 3.3877 17.805C2.95974 17.1907 2.69228 16.4791 2.6097 15.735C2.60269 15.6665 2.59802 15.5978 2.5957 15.529V15.251C2.59557 14.9554 2.65367 14.6628 2.76669 14.3897C2.8797 14.1166 3.04541 13.8684 3.25436 13.6594C3.4633 13.4503 3.71139 13.2845 3.98443 13.1714C4.25748 13.0582 4.55015 13 4.8457 13H12.3457ZM12.5957 15.5C12.5957 15.1022 12.7537 14.7206 13.035 14.4393C13.3163 14.158 13.6979 14 14.0957 14H22.0957C22.4935 14 22.8751 14.158 23.1564 14.4393C23.4377 14.7206 23.5957 15.1022 23.5957 15.5V19.5C23.5957 19.8978 23.4377 20.2794 23.1564 20.5607C22.8751 20.842 22.4935 21 22.0957 21H14.0957C13.6979 21 13.3163 20.842 13.035 20.5607C12.7537 20.2794 12.5957 19.8978 12.5957 19.5V15.5ZM13.5957 16V17C14.1261 17 14.6348 16.7893 15.0099 16.4142C15.385 16.0391 15.5957 15.5304 15.5957 15H14.5957C14.5957 15.2652 14.4903 15.5196 14.3028 15.7071C14.1153 15.8946 13.8609 16 13.5957 16ZM22.5957 17V16C22.3305 16 22.0761 15.8946 21.8886 15.7071C21.7011 15.5196 21.5957 15.2652 21.5957 15H20.5957C20.5957 15.5304 20.8064 16.0391 21.1815 16.4142C21.5566 16.7893 22.0653 17 22.5957 17ZM20.5957 20H21.5957C21.5957 19.7348 21.7011 19.4804 21.8886 19.2929C22.0761 19.1054 22.3305 19 22.5957 19V18C22.0653 18 21.5566 18.2107 21.1815 18.5858C20.8064 18.9609 20.5957 19.4696 20.5957 20ZM13.5957 18V19C13.8609 19 14.1153 19.1054 14.3028 19.2929C14.4903 19.4804 14.5957 19.7348 14.5957 20H15.5957C15.5957 19.4696 15.385 18.9609 15.0099 18.5858C14.6348 18.2107 14.1261 18 13.5957 18ZM18.0957 19.25C18.5598 19.25 19.005 19.0656 19.3331 18.7374C19.6613 18.4092 19.8457 17.9641 19.8457 17.5C19.8457 17.0359 19.6613 16.5908 19.3331 16.2626C19.005 15.9344 18.5598 15.75 18.0957 15.75C17.6316 15.75 17.1865 15.9344 16.8583 16.2626C16.5301 16.5908 16.3457 17.0359 16.3457 17.5C16.3457 17.9641 16.5301 18.4092 16.8583 18.7374C17.1865 19.0656 17.6316 19.25 18.0957 19.25Z"
          fill="#D6D6D6"
        />
      </svg>
    ),
    optionsFromData: true,
    type: "multiple",
    order: 4,
  },
  {
    label: "Goal",
    accessor: "Goal",
    icon: (
      <svg
        width={17}
        height={16}
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.65088 15.4275V0.570312L13.9366 5.71317L3.65088 10.856"
          stroke="#D6D6D6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    optionsFromData: true,
    type: "multiple",
    order: 5,
  },
];

const Performance = () => {
  const router = useRouter();
  const { user, setUser } = useUserStore();
  const { affiliateLinks, getAffiliateLinks, isLoading } = useGetAffiliateLinks(
    { userId: user?.id || 0 }
  );

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { filteredData, filters, selectedFilters, applyFilter, setOptions } =
    useFilter<TAffiliateLink>({
      data: affiliateLinks || [],
      dataFilters: affiliateLinkFilter,
    });

  const totalRevenue = filteredData
    .reduce(
      (acc, { eventTransactions }) =>
        acc +
        ((eventTransactions &&
          eventTransactions.reduce(
            (acc, { amountPaid }) => amountPaid + acc,
            0
          )) ||
          0),
      0
    )
    .toFixed(2);

  const totalWallet = filteredData
    .reduce(
      (acc, { eventTransactions }) =>
        acc +
        ((eventTransactions &&
          eventTransactions
            .filter(({ payOutStatus }) => payOutStatus !== "Paid")
            .reduce((acc, { amountPaid }) => amountPaid + acc, 0)) ||
          0),
      0
    )
    .toFixed(2);

  const totalAffiliateCommission = filteredData
    .reduce(
      (acc, { eventTransactions, commissionType, commissionValue }) =>
        acc +
        (commissionType === "fixed"
          ? commissionValue
          : commissionValue *
            0.01 *
            (eventTransactions
              ? eventTransactions
                  .filter(
                    ({ amountPaid, registrationCompleted }) =>
                      amountPaid > 0 && registrationCompleted
                  )
                  .reduce((acc, curr) => acc + curr.amountPaid, 0)
              : 0)),
      0
    )
    .toFixed(2);

  const totalPaidAttendees = filteredData.reduce(
    (acc, { eventTransactions }) =>
      acc +
      ((eventTransactions &&
        eventTransactions
          .filter(
            ({ amountPaid, registrationCompleted }) =>
              amountPaid > 0 && registrationCompleted
          )
          .reduce((acc, { attendees }) => attendees + acc, 0)) ||
        0),
    0
  );

  const totalAffiliates = new Set(
    filteredData.map(({ affliateEmail }) => affliateEmail)
  ).size;

  useEffect(() => {
    if (isLoading || !affiliateLinks) return;

    filters
      .filter((filter) => filter.optionsFromData)
      .forEach(({ accessor }) => {
        setOptions(
          accessor,
          extractUniqueTypes<TAffiliateLink>(affiliateLinks, accessor)
        );
      });
  }, [isLoading]);

  return (
    <section className="p-4 space-y-4 w-full">
      <div className="w-full flex justify-end">
        <Button
          className="bg-basePrimary px-4 w-fit"
          onClick={() => router.push("/affiliates/link/create")}
        >
          Create Link
        </Button>
      </div>
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex md:justify-end gap-4">
          <div className="px-4 py-2 flex flex-col gap-2 bg-gray-100 border-gray-200 border-2 rounded-md min-w-[200px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={33}
              height={32}
              viewBox="0 0 33 32"
              fill="none"
            >
              <path
                d="M22.8003 4.39922C22.8003 4.08096 22.9268 3.77573 23.1518 3.55069C23.3769 3.32565 23.6821 3.19922 24.0003 3.19922H28.0003C28.3186 3.19922 28.6238 3.32565 28.8489 3.55069C29.0739 3.77573 29.2003 4.08096 29.2003 4.39922V8.39922C29.2003 8.71748 29.0739 9.0227 28.8489 9.24775C28.6238 9.47279 28.3186 9.59922 28.0003 9.59922C27.6821 9.59922 27.3769 9.47279 27.1518 9.24775C26.9268 9.0227 26.8003 8.71748 26.8003 8.39922V7.29522L19.6483 14.4472C19.4233 14.6719 19.1183 14.7982 18.8003 14.7982C18.4823 14.7982 18.1773 14.6719 17.9523 14.4472L14.0003 10.4952L7.24834 17.2472C7.13848 17.3651 7.006 17.4597 6.8588 17.5253C6.71161 17.5909 6.5527 17.6261 6.39158 17.629C6.23046 17.6318 6.07041 17.6022 5.92099 17.5418C5.77157 17.4815 5.63583 17.3916 5.52188 17.2777C5.40793 17.1637 5.3181 17.028 5.25775 16.8786C5.19739 16.7292 5.16775 16.5691 5.1706 16.408C5.17344 16.2469 5.20871 16.088 5.27429 15.9408C5.33988 15.7936 5.43444 15.6611 5.55234 15.5512L13.1523 7.95122C13.3773 7.7265 13.6823 7.60027 14.0003 7.60027C14.3183 7.60027 14.6233 7.7265 14.8483 7.95122L18.8003 11.9032L25.1043 5.59922H24.0003C23.6821 5.59922 23.3769 5.47279 23.1518 5.24775C22.9268 5.0227 22.8003 4.71748 22.8003 4.39922ZM6.40034 22.3992C6.7186 22.3992 7.02383 22.5256 7.24887 22.7507C7.47392 22.9757 7.60034 23.281 7.60034 23.5992V27.5992C7.60034 27.9175 7.47392 28.2227 7.24887 28.4477C7.02383 28.6728 6.7186 28.7992 6.40034 28.7992C6.08208 28.7992 5.77686 28.6728 5.55182 28.4477C5.32677 28.2227 5.20034 27.9175 5.20034 27.5992V23.5992C5.20034 23.281 5.32677 22.9757 5.55182 22.7507C5.77686 22.5256 6.08208 22.3992 6.40034 22.3992ZM14.0003 18.7992C14.0003 18.481 13.8739 18.1757 13.6489 17.9507C13.4238 17.7256 13.1186 17.5992 12.8003 17.5992C12.4821 17.5992 12.1769 17.7256 11.9518 17.9507C11.7268 18.1757 11.6003 18.481 11.6003 18.7992V27.5992C11.6003 27.9175 11.7268 28.2227 11.9518 28.4477C12.1769 28.6728 12.4821 28.7992 12.8003 28.7992C13.1186 28.7992 13.4238 28.6728 13.6489 28.4477C13.8739 28.2227 14.0003 27.9175 14.0003 27.5992V18.7992ZM19.2003 20.7992C19.5186 20.7992 19.8238 20.9256 20.0489 21.1507C20.2739 21.3757 20.4003 21.681 20.4003 21.9992V27.5992C20.4003 27.9175 20.2739 28.2227 20.0489 28.4477C19.8238 28.6728 19.5186 28.7992 19.2003 28.7992C18.8821 28.7992 18.5769 28.6728 18.3518 28.4477C18.1268 28.2227 18.0003 27.9175 18.0003 27.5992V21.9992C18.0003 21.681 18.1268 21.3757 18.3518 21.1507C18.5769 20.9256 18.8821 20.7992 19.2003 20.7992ZM26.8003 15.5992C26.8003 15.281 26.6739 14.9757 26.4489 14.7507C26.2238 14.5256 25.9186 14.3992 25.6003 14.3992C25.2821 14.3992 24.9769 14.5256 24.7518 14.7507C24.5268 14.9757 24.4003 15.281 24.4003 15.5992V27.5992C24.4003 27.9175 24.5268 28.2227 24.7518 28.4477C24.9769 28.6728 25.2821 28.7992 25.6003 28.7992C25.9186 28.7992 26.2238 28.6728 26.4489 28.4477C26.6739 28.2227 26.8003 27.9175 26.8003 27.5992V15.5992Z"
                fill="#001FCC"
              />
            </svg>
            <span className="text-gray-700 font-medium">Revenue</span>
            <span className="text-gray-900 font-semibold text-2xl">
              NGN
              {new Intl.NumberFormat().format(parseInt(totalRevenue))}
            </span>
          </div>
          <div className="px-4 py-2 flex flex-col gap-2 bg-gray-100 border-gray-200 border-2 rounded-md min-w-[200px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={33}
              height={32}
              viewBox="0 0 33 32"
              fill="none"
            >
              <path
                d="M4.40039 13.3333V10.6667C4.40039 9.95942 4.68134 9.28115 5.18144 8.78105C5.68154 8.28095 6.35981 8 7.06706 8H9.73372M4.40039 13.3333C6.17772 13.3333 9.73372 12.2667 9.73372 8M4.40039 13.3333V18.6667M9.73372 8H23.0671M4.40039 18.6667V21.3333C4.40039 22.0406 4.68134 22.7189 5.18144 23.219C5.68154 23.719 6.35981 24 7.06706 24H9.73372M4.40039 18.6667C6.17772 18.6667 9.73372 19.7333 9.73372 24M28.4004 13.3333V10.6667C28.4004 9.95942 28.1194 9.28115 27.6193 8.78105C27.1192 8.28095 26.441 8 25.7337 8H23.0671M28.4004 13.3333C26.6231 13.3333 23.0671 12.2667 23.0671 8M28.4004 13.3333V18.6667M28.4004 18.6667V21.3333C28.4004 22.0406 28.1194 22.7189 27.6193 23.219C27.1192 23.719 26.441 24 25.7337 24H23.0671M28.4004 18.6667C26.6231 18.6667 23.0671 19.7333 23.0671 24M23.0671 24H9.73372"
                stroke="#001FCC"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.4003 18.6654C17.8731 18.6654 19.067 17.4715 19.067 15.9987C19.067 14.5259 17.8731 13.332 16.4003 13.332C14.9275 13.332 13.7336 14.5259 13.7336 15.9987C13.7336 17.4715 14.9275 18.6654 16.4003 18.6654Z"
                stroke="#001FCC"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-gray-700 font-medium">Commission</span>
            <span className="text-gray-900 font-semibold text-2xl">
              NGN
              {new Intl.NumberFormat().format(
                parseInt(totalAffiliateCommission)
              )}
            </span>
            <div className="text-tiny text-green-500 flex items-center gap-1.5 p-1 rounded bg-green-50 w-fit">
              <span className="font-medium capitalize">
                Wallet: NGN
                {new Intl.NumberFormat().format(parseInt(totalWallet))}
              </span>
            </div>
          </div>
          <div className="px-4 py-2 flex flex-col gap-2 bg-gray-100 border-gray-200 border-2 rounded-md min-w-[200px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={33}
              height={32}
              viewBox="0 0 33 32"
              fill="none"
            >
              <g clipPath="url(#clip0_12577_7050)">
                <path
                  d="M25.7336 22.668V25.3346H9.73364V22.668C9.73364 22.668 9.73364 17.3346 17.7336 17.3346C25.7336 17.3346 25.7336 22.668 25.7336 22.668ZM21.7336 10.668C21.7336 9.87685 21.499 9.10349 21.0595 8.44569C20.62 7.78789 19.9953 7.2752 19.2644 6.97245C18.5335 6.6697 17.7292 6.59049 16.9533 6.74483C16.1774 6.89917 15.4646 7.28013 14.9052 7.83954C14.3458 8.39895 13.9648 9.11169 13.8105 9.88761C13.6562 10.6635 13.7354 11.4678 14.0381 12.1987C14.3409 12.9296 14.8536 13.5543 15.5114 13.9938C16.1692 14.4334 16.9425 14.668 17.7336 14.668C18.7945 14.668 19.8119 14.2465 20.5621 13.4964C21.3122 12.7463 21.7336 11.7288 21.7336 10.668ZM26.0003 17.4146C26.7291 18.087 27.3167 18.8979 27.7288 19.7999C28.1409 20.7018 28.3692 21.6768 28.4003 22.668V25.3346H32.4003V22.668C32.4003 22.668 32.4003 18.068 26.0003 17.4146ZM24.4003 6.66797C23.9975 6.66821 23.5971 6.73119 23.2136 6.85464C23.9937 7.97326 24.412 9.30421 24.412 10.668C24.412 12.0317 23.9937 13.3627 23.2136 14.4813C23.5971 14.6048 23.9975 14.6677 24.4003 14.668C25.4612 14.668 26.4786 14.2465 27.2287 13.4964C27.9789 12.7463 28.4003 11.7288 28.4003 10.668C28.4003 9.6071 27.9789 8.58969 27.2287 7.83954C26.4786 7.0894 25.4612 6.66797 24.4003 6.66797ZM10.187 11.8946L11.7336 13.7746L5.40031 20.108L1.73364 16.108L3.28031 14.5613L5.40031 16.668L10.187 11.8946Z"
                  fill="#001FCC"
                />
              </g>
              <defs>
                <clipPath id="clip0_12577_7050">
                  <rect
                    width={32}
                    height={32}
                    fill="white"
                    transform="translate(0.400391)"
                  />
                </clipPath>
              </defs>
            </svg>
            <span className="text-gray-700 font-medium">Paid Attendees</span>
            <span className="text-gray-900 font-semibold text-2xl">
              {totalPaidAttendees}
            </span>
          </div>
          <div className="px-4 py-2 flex flex-col gap-2 bg-gray-100 border-gray-200 border-2 rounded-md min-w-[200px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={33}
              height={32}
              viewBox="0 0 33 32"
              fill="none"
            >
              <g clipPath="url(#clip0_12577_7050)">
                <path
                  d="M25.7336 22.668V25.3346H9.73364V22.668C9.73364 22.668 9.73364 17.3346 17.7336 17.3346C25.7336 17.3346 25.7336 22.668 25.7336 22.668ZM21.7336 10.668C21.7336 9.87685 21.499 9.10349 21.0595 8.44569C20.62 7.78789 19.9953 7.2752 19.2644 6.97245C18.5335 6.6697 17.7292 6.59049 16.9533 6.74483C16.1774 6.89917 15.4646 7.28013 14.9052 7.83954C14.3458 8.39895 13.9648 9.11169 13.8105 9.88761C13.6562 10.6635 13.7354 11.4678 14.0381 12.1987C14.3409 12.9296 14.8536 13.5543 15.5114 13.9938C16.1692 14.4334 16.9425 14.668 17.7336 14.668C18.7945 14.668 19.8119 14.2465 20.5621 13.4964C21.3122 12.7463 21.7336 11.7288 21.7336 10.668ZM26.0003 17.4146C26.7291 18.087 27.3167 18.8979 27.7288 19.7999C28.1409 20.7018 28.3692 21.6768 28.4003 22.668V25.3346H32.4003V22.668C32.4003 22.668 32.4003 18.068 26.0003 17.4146ZM24.4003 6.66797C23.9975 6.66821 23.5971 6.73119 23.2136 6.85464C23.9937 7.97326 24.412 9.30421 24.412 10.668C24.412 12.0317 23.9937 13.3627 23.2136 14.4813C23.5971 14.6048 23.9975 14.6677 24.4003 14.668C25.4612 14.668 26.4786 14.2465 27.2287 13.4964C27.9789 12.7463 28.4003 11.7288 28.4003 10.668C28.4003 9.6071 27.9789 8.58969 27.2287 7.83954C26.4786 7.0894 25.4612 6.66797 24.4003 6.66797ZM10.187 11.8946L11.7336 13.7746L5.40031 20.108L1.73364 16.108L3.28031 14.5613L5.40031 16.668L10.187 11.8946Z"
                  fill="#001FCC"
                />
              </g>
              <defs>
                <clipPath id="clip0_12577_7050">
                  <rect
                    width={32}
                    height={32}
                    fill="white"
                    transform="translate(0.400391)"
                  />
                </clipPath>
              </defs>
            </svg>
            <span className="text-gray-700 font-medium">Affiliates</span>
            <span className="text-gray-900 font-semibold text-2xl">
              {totalAffiliates}
            </span>
          </div>
        </div>
      </div>
      <Filter
        className={`space-y-4 max-w-full`}
        filters={filters.sort(
          (a, b) => (a.order || Infinity) - (b.order || Infinity)
        )}
        applyFilter={applyFilter}
        selectedFilters={selectedFilters}
      />
      <div className="space-y-2 w-full overflow-auto">
        <DataTable<TAffiliateLink>
          columns={columns}
          data={affiliateLinks || []}
          rowStyle={{
            display: "grid",
            gridTemplateColumns: `1fr 1.5fr repeat(${
              columns.length - 3
            }, minmax(0, 1fr)) auto`,
          }}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
    </section>
  );
};

export default Performance;
