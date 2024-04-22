// @ts-nocheck
"use client";
import Filter from "@/components/Filter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetPayOuts } from "@/hooks/services/billing";
import { IPayOut } from "@/types/billing";
import { extractUniqueTypes } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { AngleDown } from "styled-icons/fa-solid";
import { columns } from "./columns";
import { TFilter } from "@/types/filter";
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
import { toast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/DataTable";
import { getCookie } from "@/hooks";
import { Bold, Italic, Underline } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const payOutsFilter: TFilter<TPayOut>[] = [
  {
    label: "requested by",
    accessor: "requestedBy",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M7.5 13.4995V12.4995H16.5V13.4995H7.5ZM7.5 17.4995V16.4995H13.5V17.4995H7.5ZM5.615 20.9995C5.155 20.9995 4.771 20.8455 4.463 20.5375C4.15433 20.2289 4 19.8445 4 19.3845V6.61453C4 6.15453 4.15433 5.77053 4.463 5.46253C4.771 5.15386 5.155 4.99953 5.615 4.99953H7.385V2.76953H8.462V4.99953H15.615V2.76953H16.615V4.99953H18.385C18.845 4.99953 19.229 5.15386 19.537 5.46253C19.8457 5.77053 20 6.15453 20 6.61453V19.3845C20 19.8445 19.846 20.2285 19.538 20.5365C19.2293 20.8452 18.845 20.9995 18.385 20.9995H5.615ZM5.615 19.9995H18.385C18.5383 19.9995 18.6793 19.9355 18.808 19.8075C18.936 19.6789 19 19.5379 19 19.3845V10.6145H5V19.3845C5 19.5379 5.064 19.6789 5.192 19.8075C5.32067 19.9355 5.46167 19.9995 5.615 19.9995Z"
          fill="#717171"
        />
      </svg>
    ),
    optionsFromData: true,
    type: "multiple",
    order: 1,
  },
  {
    label: "request Date",
    accessor: "created_at",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={25}
        height={24}
        viewBox="0 0 25 24"
        fill="none"
      >
        <path
          d="M9.27979 11H7.27979V13H9.27979V11ZM13.2798 11H11.2798V13H13.2798V11ZM17.2798 11H15.2798V13H17.2798V11ZM19.2798 4H18.2798V2H16.2798V4H8.27979V2H6.27979V4H5.27979C4.16979 4 3.28979 4.9 3.28979 6L3.27979 20C3.27979 20.5304 3.4905 21.0391 3.86557 21.4142C4.24064 21.7893 4.74935 22 5.27979 22H19.2798C20.3798 22 21.2798 21.1 21.2798 20V6C21.2798 4.9 20.3798 4 19.2798 4ZM19.2798 20H5.27979V9H19.2798V20Z"
          fill="#717171"
        />
      </svg>
    ),
    type: "dateRange",
    order: 6,
  },
  {
    label: "Payout Status",
    accessor: "payOutStatus",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={21}
        height={20}
        viewBox="0 0 21 20"
        fill="none"
      >
        <g clipPath="url(#clip0_11614_15267)">
          <path
            d="M20.4402 10C20.4402 10.9245 20.323 11.8099 20.0886 12.6562C19.8542 13.5026 19.519 14.3001 19.0828 15.0488C18.6466 15.7975 18.1257 16.4714 17.5203 17.0703C16.9148 17.6693 16.2377 18.1901 15.489 18.6328C14.7403 19.0755 13.9428 19.4108 13.0964 19.6387C12.2501 19.8665 11.3647 19.987 10.4402 20C9.51571 20 8.63029 19.8828 7.78394 19.6484C6.93758 19.4141 6.14006 19.0788 5.39136 18.6426C4.64266 18.2064 3.96883 17.6855 3.36987 17.0801C2.77091 16.4746 2.25008 15.7975 1.80737 15.0488C1.36466 14.3001 1.02938 13.5026 0.801514 12.6562C0.573649 11.8099 0.453206 10.9245 0.440186 10C0.440186 9.08203 0.557373 8.19661 0.791748 7.34375C1.02612 6.49089 1.36141 5.69336 1.79761 4.95117C2.23381 4.20898 2.75464 3.53516 3.36011 2.92969C3.96558 2.32422 4.64266 1.80339 5.39136 1.36719C6.14006 0.93099 6.93758 0.595703 7.78394 0.361328C8.63029 0.126953 9.51571 0.00651042 10.4402 0C11.3582 0 12.2436 0.117188 13.0964 0.351562C13.9493 0.585938 14.7468 0.921224 15.489 1.35742C16.2312 1.79362 16.905 2.31445 17.5105 2.91992C18.116 3.52539 18.6368 4.20247 19.073 4.95117C19.5092 5.69987 19.8445 6.4974 20.0789 7.34375C20.3132 8.1901 20.4337 9.07552 20.4402 10ZM10.4402 18.75C11.241 18.75 12.0125 18.6458 12.7546 18.4375C13.4968 18.2292 14.1934 17.9362 14.8445 17.5586C15.4955 17.181 16.088 16.722 16.6218 16.1816C17.1557 15.6413 17.6114 15.0521 17.989 14.4141C18.3666 13.776 18.6628 13.0794 18.8777 12.3242C19.0925 11.569 19.1967 10.7943 19.1902 10C19.1902 9.19922 19.086 8.42773 18.8777 7.68555C18.6694 6.94336 18.3764 6.24674 17.9988 5.5957C17.6212 4.94466 17.1622 4.35221 16.6218 3.81836C16.0815 3.28451 15.4923 2.82878 14.8542 2.45117C14.2162 2.07357 13.5196 1.77734 12.7644 1.5625C12.0092 1.34766 11.2345 1.24349 10.4402 1.25C9.63289 1.25 8.85815 1.35417 8.11597 1.5625C7.37378 1.77083 6.68042 2.0638 6.03589 2.44141C5.39136 2.81901 4.79891 3.27799 4.25854 3.81836C3.71818 4.35872 3.26245 4.94792 2.89136 5.58594C2.52026 6.22396 2.22404 6.92057 2.00269 7.67578C1.78133 8.43099 1.67716 9.20573 1.69019 10C1.69019 10.8073 1.79435 11.582 2.00269 12.3242C2.21102 13.0664 2.50399 13.7598 2.88159 14.4043C3.2592 15.0488 3.71818 15.6413 4.25854 16.1816C4.79891 16.722 5.3881 17.1777 6.02612 17.5488C6.66414 17.9199 7.36076 18.2161 8.11597 18.4375C8.87117 18.6589 9.64592 18.763 10.4402 18.75ZM10.4402 13.75C10.7983 13.75 11.1466 13.7012 11.4851 13.6035C11.8236 13.5059 12.1427 13.3594 12.4421 13.1641C12.7416 12.9688 13.0053 12.7441 13.2332 12.4902C13.461 12.2363 13.6596 11.9401 13.8289 11.6016L14.9617 12.1484C14.7533 12.5846 14.4929 12.9785 14.1804 13.3301C13.8679 13.6816 13.5131 13.9811 13.116 14.2285C12.7188 14.4759 12.2957 14.6647 11.8464 14.7949C11.3972 14.9251 10.9285 14.9935 10.4402 15C9.72404 15 9.04045 14.8535 8.3894 14.5605C7.73836 14.2676 7.17196 13.8509 6.69019 13.3105V15H5.44019V11.25H9.19019V12.5H7.64722C7.99878 12.8906 8.4187 13.1966 8.90698 13.418C9.39526 13.6393 9.90633 13.75 10.4402 13.75ZM14.1902 6.68945V5H15.4402V8.75H11.6902V7.5H13.2332C12.8816 7.10938 12.4617 6.80339 11.9734 6.58203C11.4851 6.36068 10.974 6.25 10.4402 6.25C10.0821 6.25 9.73381 6.29883 9.39526 6.39648C9.05672 6.49414 8.73771 6.64062 8.43823 6.83594C8.13875 7.03125 7.87508 7.25586 7.64722 7.50977C7.41935 7.76367 7.22078 8.0599 7.05151 8.39844L5.9187 7.85156C6.12703 7.41536 6.38745 7.02148 6.69995 6.66992C7.01245 6.31836 7.36727 6.01888 7.7644 5.77148C8.16154 5.52409 8.58472 5.33529 9.03394 5.20508C9.48315 5.07487 9.9519 5.00651 10.4402 5C11.1563 5 11.8399 5.14648 12.491 5.43945C13.142 5.73242 13.7084 6.14909 14.1902 6.68945Z"
            fill="#717171"
          />
        </g>
        <defs>
          <clipPath id="clip0_11614_15267">
            <rect
              width={20}
              height={20}
              fill="white"
              transform="translate(0.440186)"
            />
          </clipPath>
        </defs>
      </svg>
    ),
    optionsFromData: true,
    type: "multiple",
    order: 7,
  },
  {
    label: "Amount",
    accessor: "Amount",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={21}
        height={20}
        viewBox="0 0 21 20"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.6007 2.29297C8.55629 2.29297 6.59565 3.10509 5.15005 4.55069C3.70446 5.99628 2.89233 7.95692 2.89233 10.0013C2.89233 12.0457 3.70446 14.0063 5.15005 15.4519C6.59565 16.8975 8.55629 17.7096 10.6007 17.7096C12.645 17.7096 14.6057 16.8975 16.0513 15.4519C17.4969 14.0063 18.309 12.0457 18.309 10.0013C18.309 7.95692 17.4969 5.99628 16.0513 4.55069C14.6057 3.10509 12.645 2.29297 10.6007 2.29297ZM1.64233 10.0013C1.64233 5.0538 5.65317 1.04297 10.6007 1.04297C15.5482 1.04297 19.559 5.0538 19.559 10.0013C19.559 14.9488 15.5482 18.9596 10.6007 18.9596C5.65317 18.9596 1.64233 14.9488 1.64233 10.0013ZM10.6007 4.3763C10.7664 4.3763 10.9254 4.44215 11.0426 4.55936C11.1598 4.67657 11.2257 4.83554 11.2257 5.0013V5.26547C12.584 5.5088 13.7257 6.52964 13.7257 7.91797C13.7257 8.08373 13.6598 8.2427 13.5426 8.35991C13.4254 8.47712 13.2664 8.54297 13.1007 8.54297C12.9349 8.54297 12.7759 8.47712 12.6587 8.35991C12.5415 8.2427 12.4757 8.08373 12.4757 7.91797C12.4757 7.35297 12.0057 6.7538 11.2257 6.54047V9.43214C12.584 9.67547 13.7257 10.6963 13.7257 12.0846C13.7257 13.473 12.584 14.4938 11.2257 14.7371V15.0013C11.2257 15.1671 11.1598 15.326 11.0426 15.4432C10.9254 15.5605 10.7664 15.6263 10.6007 15.6263C10.4349 15.6263 10.2759 15.5605 10.1587 15.4432C10.0415 15.326 9.97567 15.1671 9.97567 15.0013V14.7371C8.61733 14.4938 7.47567 13.473 7.47567 12.0846C7.47567 11.9189 7.54152 11.7599 7.65873 11.6427C7.77594 11.5255 7.93491 11.4596 8.10067 11.4596C8.26643 11.4596 8.4254 11.5255 8.54261 11.6427C8.65982 11.7599 8.72567 11.9189 8.72567 12.0846C8.72567 12.6496 9.19567 13.2488 9.97567 13.4613V10.5705C8.61733 10.3271 7.47567 9.3063 7.47567 7.91797C7.47567 6.52964 8.61733 5.5088 9.97567 5.26547V5.0013C9.97567 4.83554 10.0415 4.67657 10.1587 4.55936C10.2759 4.44215 10.4349 4.3763 10.6007 4.3763ZM9.97567 6.54047C9.19567 6.7538 8.72567 7.35297 8.72567 7.91797C8.72567 8.48297 9.19567 9.08214 9.97567 9.29464V6.54047ZM11.2257 10.7071V13.4621C12.0057 13.2488 12.4757 12.6505 12.4757 12.0846C12.4757 11.5196 12.0057 10.9196 11.2257 10.7071Z"
          fill="#717171"
        />
      </svg>
    ),
    type: "range",
    steps: 100,
    max: 1000000,
    order: 5,
  },
  {
    label: "Payout Date",
    accessor: "paidAt",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={21}
        height={20}
        viewBox="0 0 21 20"
        fill="none"
      >
        <path
          d="M7.6604 9.16797H5.99373V10.8346H7.6604V9.16797ZM10.9937 9.16797H9.32707V10.8346H10.9937V9.16797ZM14.3271 9.16797H12.6604V10.8346H14.3271V9.16797ZM15.9937 3.33464H15.1604V1.66797H13.4937V3.33464H6.82707V1.66797H5.1604V3.33464H4.32707C3.40207 3.33464 2.66873 4.08464 2.66873 5.0013L2.6604 16.668C2.6604 17.11 2.836 17.5339 3.14856 17.8465C3.46112 18.159 3.88504 18.3346 4.32707 18.3346H15.9937C16.9104 18.3346 17.6604 17.5846 17.6604 16.668V5.0013C17.6604 4.08464 16.9104 3.33464 15.9937 3.33464ZM15.9937 16.668H4.32707V7.5013H15.9937V16.668Z"
          fill="#717171"
        />
      </svg>
    ),
    type: "dateRange",
    order: 8,
  },
  {
    label: "Currency",
    accessor: "currency",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={21}
        height={20}
        viewBox="0 0 21 20"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.6007 2.29297C8.55629 2.29297 6.59565 3.10509 5.15005 4.55069C3.70446 5.99628 2.89233 7.95692 2.89233 10.0013C2.89233 12.0457 3.70446 14.0063 5.15005 15.4519C6.59565 16.8975 8.55629 17.7096 10.6007 17.7096C12.645 17.7096 14.6057 16.8975 16.0513 15.4519C17.4969 14.0063 18.309 12.0457 18.309 10.0013C18.309 7.95692 17.4969 5.99628 16.0513 4.55069C14.6057 3.10509 12.645 2.29297 10.6007 2.29297ZM1.64233 10.0013C1.64233 5.0538 5.65317 1.04297 10.6007 1.04297C15.5482 1.04297 19.559 5.0538 19.559 10.0013C19.559 14.9488 15.5482 18.9596 10.6007 18.9596C5.65317 18.9596 1.64233 14.9488 1.64233 10.0013ZM10.6007 4.3763C10.7664 4.3763 10.9254 4.44215 11.0426 4.55936C11.1598 4.67657 11.2257 4.83554 11.2257 5.0013V5.26547C12.584 5.5088 13.7257 6.52964 13.7257 7.91797C13.7257 8.08373 13.6598 8.2427 13.5426 8.35991C13.4254 8.47712 13.2664 8.54297 13.1007 8.54297C12.9349 8.54297 12.7759 8.47712 12.6587 8.35991C12.5415 8.2427 12.4757 8.08373 12.4757 7.91797C12.4757 7.35297 12.0057 6.7538 11.2257 6.54047V9.43214C12.584 9.67547 13.7257 10.6963 13.7257 12.0846C13.7257 13.473 12.584 14.4938 11.2257 14.7371V15.0013C11.2257 15.1671 11.1598 15.326 11.0426 15.4432C10.9254 15.5605 10.7664 15.6263 10.6007 15.6263C10.4349 15.6263 10.2759 15.5605 10.1587 15.4432C10.0415 15.326 9.97567 15.1671 9.97567 15.0013V14.7371C8.61733 14.4938 7.47567 13.473 7.47567 12.0846C7.47567 11.9189 7.54152 11.7599 7.65873 11.6427C7.77594 11.5255 7.93491 11.4596 8.10067 11.4596C8.26643 11.4596 8.4254 11.5255 8.54261 11.6427C8.65982 11.7599 8.72567 11.9189 8.72567 12.0846C8.72567 12.6496 9.19567 13.2488 9.97567 13.4613V10.5705C8.61733 10.3271 7.47567 9.3063 7.47567 7.91797C7.47567 6.52964 8.61733 5.5088 9.97567 5.26547V5.0013C9.97567 4.83554 10.0415 4.67657 10.1587 4.55936C10.2759 4.44215 10.4349 4.3763 10.6007 4.3763ZM9.97567 6.54047C9.19567 6.7538 8.72567 7.35297 8.72567 7.91797C8.72567 8.48297 9.19567 9.08214 9.97567 9.29464V6.54047ZM11.2257 10.7071V13.4621C12.0057 13.2488 12.4757 12.6505 12.4757 12.0846C12.4757 11.5196 12.0057 10.9196 11.2257 10.7071Z"
          fill="#717171"
        />
      </svg>
    ),
    type: "single",
    optionsFromData: true,
    order: 4,
    defaultValue: "NGN",
  },
];

const PAYOUT_TABS = [
  { label: "New", value: "requested" },
  { label: "Paid", value: "paid" },
  { label: "Pending", value: "pending" },
  { label: "failed", value: "failed" },
];

export default function page() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const user = getCookie("user");
  const { payOuts, isLoading } = useGetPayOuts({ userId: user.id || 0 });

  console.log(payOuts);

  const { filteredData, filters, selectedFilters, applyFilter, setOptions } =
    useFilter<IPayOut>({
      data: payOuts,
      dataFilters: payOutsFilter,
    });

  // console.log(filteredData, payOuts);

  useEffect(() => {
    if (isLoading) return;

    filters
      .filter((filter) => filter.optionsFromData)
      .forEach(({ accessor }) => {
        setOptions(accessor, extractUniqueTypes<TPayOut>(payOuts, accessor));
      });
  }, [isLoading]);

  // console.log(payOuts);

  const onChange = (accessorKey: string) =>
    setShownColumns((prevShown) =>
      prevShown.includes(accessorKey)
        ? prevShown.filter((item) => item !== accessorKey)
        : [...prevShown, accessorKey]
    );

  const [currentTab, setTab] = useState("requested");

  return (
    <section className="bg-white pt-8 pb-4 space-y-6">
      <header className="space-y-4">
        <div className="px-2 md:px-4">
          <h1 className="text-basePrimary font-bold text-3xl">Payout</h1>
          <p className="text-xl text-gray-800 font-medium">
            View and manage payouts
          </p>
        </div>
        <ToggleGroup
          type="single"
          onValueChange={(value) => setTab(value)}
          value={currentTab}
          className="w-full flex gap-6 justify-start px-4 bg-gray-50"
        >
          {PAYOUT_TABS.map(({ label, value }) => (
            <ToggleGroupItem
              className="text-base font-medium rounded-none hover:bg-basePrimary/10 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-transparent data-[state=on]:border-b-2 data-[state=on]:border-b-basePrimary bg-transparent h-14"
              value={value}
              aria-label={"tab " + label}
            >
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </header>
      <section className="space-y-6 max-w-full px-4">
        <div className="space-y-4">
          <div className="flex justify-between md:items-end flex-col md:flex-row gap-y-2">
            <span className="text-gray-500 font-medium text-sm">
              {Object.entries(rowSelection).length}/{filteredData.length}{" "}
              Transactions selected
            </span>
            <div className="flex gap-0 md:gap-4 justify-between md:justify-start">
              {/* <Dialog
                onOpenChange={(newOpen) => {
                  console.log(
                    filteredData.filter(({ id }) => rowSelection[id]).length ===
                      0
                  );
                  if (
                    newOpen &&
                    filteredData.filter(({ id }) => rowSelection[id]).length ===
                      0
                  )
                    toast({
                      description: "Please select unrequested transactions",
                    });
                }}
              >
                <DialogTrigger
                  asChild
                  disabled={
                    filteredData.filter(({ id }) => rowSelection[id]).length ===
                    0
                  }
                >
                  <Button className="bg-basePrimary px-4">Payout</Button>
                </DialogTrigger>
                <DialogContent className="px-3 max-h-[500px] hide-scrollbar overflow-auto">
                  <DialogHeader>
                    <DialogTitle>
                      <span className="capitalize">Request Payout</span>
                    </DialogTitle>
                  </DialogHeader>
                  <RequestPayoutDialog
                    selectedRows={filteredData.filter(
                      ({ id }) => rowSelection[id]
                    )}
                    getPayOuts={getPayOuts}
                  />
                </DialogContent>
              </Dialog> */}
              {/* <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-white border-[1px] border-basePrimary text-basePrimary flex gap-2 items-center w-fit px-4">
                    <span>More Column Options</span>{" "}
                    <AngleDown className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 space-y-4 px-4 h-[500px] hide-scrollbar overflow-auto">
                  {columns
                    .filter(({ accessorKey }) => accessorKey)
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
                          {header}
                        </label>
                      </div>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu> */}
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
            className={`space-y-4 max-w-full overflow-auto hide-scrollbar`}
            filters={filters.sort(
              (a, b) => (a.order || Infinity) - (b.order || Infinity)
            )}
            applyFilter={applyFilter}
            selectedFilters={selectedFilters}
          />

          <div className="space-y-2 max-w-full overflow-auto">
            <DataTable<IPayOut>
              columns={columns}
              data={filteredData.filter(
                ({ payOutStatus }) => payOutStatus === currentTab
              )}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              canSelectRow={(row) => true}
              rowStyle={{
                display: "grid",
                gridTemplateColumns: `auto 1.5fr repeat(${
                  columns.length - 2
                }, minmax(0, 1fr))`,
              }}
            />
          </div>
        </div>
      </section>
    </section>
  );
}
