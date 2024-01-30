"use client";
import Filter from "@/components/Filter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetEventTransactions } from "@/hooks/services/billing";
import { TEventTransaction } from "@/types/billing";
import { extractUniqueTypes } from "@/utils/helpers";
import { ReactNode, useEffect, useState } from "react";
import { AngleDown } from "styled-icons/fa-solid";
import { columns } from "../columns";
import { DataTable } from "../data-table";
import { useFilter } from "@/hooks/common/useFilter";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RowSelectionState } from "@tanstack/react-table";
import RequestPayoutDialog from "@/components/requestPayoutDialog";
import { toast } from "@/components/ui/use-toast";
import { eventTransactionsFilter } from "./filters";

export default function All() {
  const [shownColumns, setShownColumns] = useState<string[]>([
    "select",
    "event",
    "userEmail",
    "eventRegistrationRef",
    "created_at",
    "attendees",
    "amountPaid",
    "registrationCompleted",
    "payOutStatus",
  ]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const { eventTransactions, isLoading, getEventTransactions } =
    useGetEventTransactions({
      userId: 1,
    });

  const { filteredData, filters, selectedFilters, applyFilter, setOptions } =
    useFilter<TEventTransaction>({
      data: eventTransactions,
      dataFilters: eventTransactionsFilter,
    });

  const totalRevenue = filteredData.reduce(
    (acc, { amountPaid }) => amountPaid + acc,
    0
  );
  const totalWallet = filteredData
    .filter(({ payOutStatus }) => payOutStatus !== "Paid")
    .reduce((acc, { amountPaid }) => amountPaid + acc, 0);
  const totalAffiliateCommission = eventTransactions.reduce(
    (acc, { affliateCommission }) => acc + affliateCommission,
    0
  );
  const totalAttendees = filteredData.reduce(
    (acc, { attendees }) => attendees + acc,
    0
  );

  useEffect(() => {
    if (isLoading) return;

    filters
      .filter((filter) => filter.optionsFromData)
      .forEach(({ accessor }) => {
        setOptions(
          accessor,
          extractUniqueTypes<TEventTransaction>(eventTransactions, accessor)
        );
      });
  }, [isLoading]);

  const onChange = (accessorKey: string) =>
    setShownColumns((prevShown) =>
      prevShown.includes(accessorKey)
        ? prevShown.filter((item) => item !== accessorKey)
        : [...prevShown, accessorKey]
    );

  return (
    <section className="space-y-6 max-w-full">
      <div className="flex justify-end gap-4">
        <div className="px-4 py-2 flex flex-col gap-2 bg-gray-100 border-gray-200 border-2 rounded-md w-[200px]">
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
            ₦{new Intl.NumberFormat().format(totalRevenue)}
          </span>
          <div className="text-tiny text-green-500 flex items-center gap-1.5 p-1 rounded bg-green-50 w-fit">
            <span className="font-medium capitalize">
              Wallet: ₦{new Intl.NumberFormat().format(totalWallet)}
            </span>
          </div>
        </div>
        <div className="px-4 py-2 flex flex-col gap-2 bg-gray-100 border-gray-200 border-2 rounded-md w-[200px]">
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
          <span className="text-gray-700 font-medium">
            Affiliate Commission
          </span>
          <span className="text-gray-900 font-semibold text-2xl">
            ₦{new Intl.NumberFormat().format(totalAffiliateCommission)}
          </span>
        </div>
        <div className="px-4 py-2 flex flex-col gap-2 bg-gray-100 border-gray-200 border-2 rounded-md w-[200px]">
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
          <span className="text-gray-700 font-medium">Attendees</span>
          <span className="text-gray-900 font-semibold text-2xl">
            {totalAttendees}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-gray-500 font-medium text-sm">
            {Object.entries(rowSelection).length}/{filteredData.length}{" "}
            Transactions selected
          </span>
          <div className="flex gap-4">
            <Dialog
              onOpenChange={(newOpen) => {
                console.log(
                  filteredData.filter(({ id }) => rowSelection[id]).length === 0
                );
                if (
                  newOpen &&
                  filteredData.filter(({ id }) => rowSelection[id]).length === 0
                )
                  toast({
                    description: "Please select unrequested transactions",
                  });
              }}
            >
              <DialogTrigger
                asChild
                disabled={
                  filteredData.filter(({ id }) => rowSelection[id]).length === 0
                }
              >
                <Button className="bg-basePrimary w-full">
                  Request Payout
                </Button>
              </DialogTrigger>
              <DialogContent className="px-3">
                <DialogHeader>
                  <DialogTitle>
                    <span className="capitalize">Request Payout</span>
                  </DialogTitle>
                </DialogHeader>
                <RequestPayoutDialog
                  selectedRows={filteredData.filter(
                    ({ id }) => rowSelection[id]
                  )}
                  getEventTransactions={getEventTransactions}
                />
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-white border-[1px] border-basePrimary text-basePrimary flex gap-2 items-center">
                  <span>More Column Options</span>{" "}
                  <AngleDown className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 space-y-4 px-4 hide-scrollbar overflow-auto">
                {columns
                  .filter(
                    (column) =>
                      ![
                        "select",
                        "event",
                        "payOutStatus",
                        "amountPaid",
                        "payOutDate",
                        "registrationCompleted",
                        "created_at",
                      ].includes(column?.accessorKey)
                  )
                  .map(({ header, accessorKey }) => (
                    <div
                      key={accessorKey}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        className="data-[state=checked]:bg-basePrimary"
                        id="terms"
                        onCheckedChange={() => onChange(accessorKey)}
                        checked={shownColumns.includes(accessorKey)}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium text-gray-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {header as ReactNode}
                      </label>
                    </div>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.25 10.5001V19.5001C20.25 19.8979 20.092 20.2795 19.8107 20.5608C19.5294 20.8421 19.1478 21.0001 18.75 21.0001H5.25C4.85218 21.0001 4.47064 20.8421 4.18934 20.5608C3.90804 20.2795 3.75 19.8979 3.75 19.5001V10.5001C3.75 10.1023 3.90804 9.72075 4.18934 9.43944C4.47064 9.15814 4.85218 9.0001 5.25 9.0001H7.5C7.69891 9.0001 7.88968 9.07912 8.03033 9.21977C8.17098 9.36042 8.25 9.55119 8.25 9.7501C8.25 9.94901 8.17098 10.1398 8.03033 10.2804C7.88968 10.4211 7.69891 10.5001 7.5 10.5001H5.25V19.5001H18.75V10.5001H16.5C16.3011 10.5001 16.1103 10.4211 15.9697 10.2804C15.829 10.1398 15.75 9.94901 15.75 9.7501C15.75 9.55119 15.829 9.36042 15.9697 9.21977C16.1103 9.07912 16.3011 9.0001 16.5 9.0001H18.75C19.1478 9.0001 19.5294 9.15814 19.8107 9.43944C20.092 9.72075 20.25 10.1023 20.25 10.5001ZM8.78063 6.53073L11.25 4.06041V12.7501C11.25 12.949 11.329 13.1398 11.4697 13.2804C11.6103 13.4211 11.8011 13.5001 12 13.5001C12.1989 13.5001 12.3897 13.4211 12.5303 13.2804C12.671 13.1398 12.75 12.949 12.75 12.7501V4.06041L15.2194 6.53073C15.3601 6.67146 15.551 6.75052 15.75 6.75052C15.949 6.75052 16.1399 6.67146 16.2806 6.53073C16.4214 6.39 16.5004 6.19912 16.5004 6.0001C16.5004 5.80108 16.4214 5.61021 16.2806 5.46948L12.5306 1.71948C12.461 1.64974 12.3783 1.59443 12.2872 1.55668C12.1962 1.51894 12.0986 1.49951 12 1.49951C11.9014 1.49951 11.8038 1.51894 11.7128 1.55668C11.6217 1.59443 11.539 1.64974 11.4694 1.71948L7.71937 5.46948C7.57864 5.61021 7.49958 5.80108 7.49958 6.0001C7.49958 6.19912 7.57864 6.39 7.71938 6.53073C7.86011 6.67146 8.05098 6.75052 8.25 6.75052C8.44902 6.75052 8.63989 6.67146 8.78063 6.53073Z"
                  fill="#3E404B"
                />
              </svg>
            </button>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                  stroke="#15161B"
                />
                <path
                  d="M14.1932 2.152C13.8262 2 13.3602 2 12.4282 2C11.4962 2 11.0302 2 10.6632 2.152C10.4204 2.25251 10.1997 2.3999 10.0139 2.58572C9.82808 2.77155 9.6807 2.99218 9.58019 3.235C9.48819 3.458 9.45118 3.719 9.43718 4.098C9.43095 4.37199 9.35519 4.6399 9.217 4.87657C9.07881 5.11324 8.88273 5.31091 8.64718 5.451C8.40808 5.58504 8.13883 5.6561 7.86472 5.6575C7.59061 5.6589 7.32064 5.59059 7.08018 5.459C6.74418 5.281 6.50118 5.183 6.26018 5.151C5.7345 5.08187 5.20288 5.22431 4.78219 5.547C4.46819 5.79 4.23418 6.193 3.76818 7C3.30218 7.807 3.06818 8.21 3.01718 8.605C2.98282 8.86545 3.0001 9.13012 3.06805 9.38389C3.136 9.63767 3.25328 9.87556 3.41318 10.084C3.56118 10.276 3.76818 10.437 4.08918 10.639C4.56218 10.936 4.86619 11.442 4.86619 12C4.86619 12.558 4.56218 13.064 4.08918 13.36C3.76818 13.563 3.56018 13.724 3.41318 13.916C3.25328 14.1244 3.136 14.3623 3.06805 14.6161C3.0001 14.8699 2.98282 15.1345 3.01718 15.395C3.06918 15.789 3.30218 16.193 3.76718 17C4.23418 17.807 4.46719 18.21 4.78219 18.453C4.99062 18.6129 5.22852 18.7302 5.48229 18.7981C5.73606 18.8661 6.00073 18.8834 6.26119 18.849C6.50119 18.817 6.74418 18.719 7.08018 18.541C7.32064 18.4094 7.59061 18.3411 7.86472 18.3425C8.13883 18.3439 8.40808 18.415 8.64718 18.549C9.13018 18.829 9.41718 19.344 9.43718 19.902C9.45118 20.282 9.48719 20.542 9.58019 20.765C9.6807 21.0078 9.82808 21.2284 10.0139 21.4143C10.1997 21.6001 10.4204 21.7475 10.6632 21.848C11.0302 22 11.4962 22 12.4282 22C13.3602 22 13.8262 22 14.1932 21.848C14.436 21.7475 14.6566 21.6001 14.8425 21.4143C15.0283 21.2284 15.1757 21.0078 15.2762 20.765C15.3682 20.542 15.4052 20.282 15.4192 19.902C15.4392 19.344 15.7262 18.828 16.2092 18.549C16.4483 18.415 16.7175 18.3439 16.9917 18.3425C17.2658 18.3411 17.5357 18.4094 17.7762 18.541C18.1122 18.719 18.3552 18.817 18.5952 18.849C18.8556 18.8834 19.1203 18.8661 19.3741 18.7981C19.6278 18.7302 19.8657 18.6129 20.0742 18.453C20.3892 18.211 20.6222 17.807 21.0882 17C21.5542 16.193 21.7882 15.79 21.8392 15.395C21.8735 15.1345 21.8563 14.8699 21.7883 14.6161C21.7204 14.3623 21.6031 14.1244 21.4432 13.916C21.2952 13.724 21.0882 13.563 20.7672 13.361C20.5329 13.2186 20.3387 13.019 20.2028 12.7809C20.0669 12.5428 19.9937 12.2741 19.9902 12C19.9902 11.442 20.2942 10.936 20.7672 10.64C21.0882 10.437 21.2962 10.276 21.4432 10.084C21.6031 9.87556 21.7204 9.63767 21.7883 9.38389C21.8563 9.13012 21.8735 8.86545 21.8392 8.605C21.7872 8.211 21.5542 7.807 21.0892 7C20.6222 6.193 20.3892 5.79 20.0742 5.547C19.8657 5.38709 19.6278 5.26981 19.3741 5.20187C19.1203 5.13392 18.8556 5.11664 18.5952 5.151C18.3552 5.183 18.1122 5.281 17.7752 5.459C17.5348 5.59042 17.2651 5.65862 16.9912 5.65722C16.7172 5.65582 16.4482 5.58486 16.2092 5.451C15.9736 5.31091 15.7776 5.11324 15.6394 4.87657C15.5012 4.6399 15.4254 4.37199 15.4192 4.098C15.4052 3.718 15.3692 3.458 15.2762 3.235C15.1757 2.99218 15.0283 2.77155 14.8425 2.58572C14.6566 2.3999 14.436 2.25251 14.1932 2.152Z"
                  stroke="#15161B"
                />
              </svg>
            </button>
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
        <div className="space-y-2 max-w-full">
          <DataTable
            columns={columns.filter(({ accessorKey }) =>
              shownColumns.includes(accessorKey)
            )}
            data={filteredData}
            state={{ rowSelection }}
            onRowSelectionChange={setRowSelection}
          />
        </div>
      </div>
    </section>
  );
}
