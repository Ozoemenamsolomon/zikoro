"use client";
import Filter from "@/components/Filter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetBillings } from "@/hooks/services/billing";
import { TEventTransaction } from "@/types/billing";
import { extractUniqueTypes } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { AngleDown } from "styled-icons/fa-solid";
import { columns } from "../columns";
import { DataTable } from "../data-table";
import { TFilter } from "@/types/filter";
import { useFilter } from "@/hooks/common/useFilter";

const billingsFilter: TFilter<TEventTransaction>[] = [
  {
    label: "Event",
    accessor: "event",
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
  },
  {
    label: "Trans. Date",
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
          d="M18.3804 17.5L13.3804 12.5M3.38037 8.33333C3.38037 9.09938 3.53125 9.85792 3.82441 10.5657C4.11756 11.2734 4.54724 11.9164 5.08891 12.4581C5.63059 12.9998 6.27365 13.4295 6.98138 13.7226C7.68912 14.0158 8.44766 14.1667 9.2137 14.1667C9.97975 14.1667 10.7383 14.0158 11.446 13.7226C12.1538 13.4295 12.7968 12.9998 13.3385 12.4581C13.8802 11.9164 14.3098 11.2734 14.603 10.5657C14.8962 9.85792 15.047 9.09938 15.047 8.33333C15.047 7.56729 14.8962 6.80875 14.603 6.10101C14.3098 5.39328 13.8802 4.75022 13.3385 4.20854C12.7968 3.66687 12.1538 3.23719 11.446 2.94404C10.7383 2.65088 9.97975 2.5 9.2137 2.5C8.44766 2.5 7.68912 2.65088 6.98138 2.94404C6.27365 3.23719 5.63059 3.66687 5.08891 4.20854C4.54724 4.75022 4.11756 5.39328 3.82441 6.10101C3.53125 6.80875 3.38037 7.56729 3.38037 8.33333Z"
          stroke="#717171"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.8805 5.83333H8.79712C8.4656 5.83333 8.14766 5.96503 7.91324 6.19945C7.67882 6.43387 7.54712 6.75181 7.54712 7.08333C7.54712 7.41485 7.67882 7.7328 7.91324 7.96722C8.14766 8.20164 8.4656 8.33333 8.79712 8.33333H9.63045C9.96197 8.33333 10.2799 8.46503 10.5143 8.69945C10.7488 8.93387 10.8805 9.25181 10.8805 9.58333C10.8805 9.91485 10.7488 10.2328 10.5143 10.4672C10.2799 10.7016 9.96197 10.8333 9.63045 10.8333H7.54712M9.21379 10.8333V11.6667M9.21379 5V5.83333"
          stroke="#717171"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    optionsFromData: true,
    type: "multiple",
  },
  {
    label: "Amount",
    accessor: "amountPaid",
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
    max: 100000,
  },
  {
    label: "Payout Date",
    accessor: "payOutDate",
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
  },
  {
    label: "Registration Status",
    accessor: "registrationCompleted",
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
    options: [
      { label: "Paid", value: true },
      { label: "Not Paid", value: false },
    ],
  },
  {
    label: "Ticket Category",
    accessor: "ticketCategory",
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
          d="M10.5166 1.04297H10.6032C11.3524 1.04297 11.9766 1.04297 12.4716 1.10964C12.9949 1.17964 13.4674 1.33464 13.8466 1.7138C14.2266 2.0938 14.3816 2.5663 14.4516 3.0888C14.5016 3.45547 14.5141 3.89214 14.5174 4.39714C15.0574 4.41464 15.5391 4.44714 15.9674 4.5038C16.9441 4.63547 17.7349 4.91214 18.3591 5.53547C18.9824 6.15964 19.2591 6.95047 19.3907 7.92713C19.5182 8.87713 19.5182 10.0896 19.5182 11.6213V11.7146C19.5182 13.2463 19.5182 14.4596 19.3907 15.4088C19.2591 16.3855 18.9824 17.1763 18.3591 17.8005C17.7349 18.4238 16.9441 18.7005 15.9674 18.8321C15.0174 18.9596 13.8049 18.9596 12.2732 18.9596H8.84656C7.3149 18.9596 6.10156 18.9596 5.1524 18.8321C4.17573 18.7005 3.3849 18.4238 2.76073 17.8005C2.1374 17.1763 1.86073 16.3855 1.72906 15.4088C1.60156 14.4588 1.60156 13.2463 1.60156 11.7146V11.6213C1.60156 10.0896 1.60156 8.8763 1.72906 7.92713C1.86073 6.95047 2.1374 6.15964 2.76073 5.53547C3.3849 4.91214 4.17573 4.63547 5.1524 4.5038C5.63366 4.44421 6.11759 4.40862 6.6024 4.39714C6.60573 3.89214 6.61906 3.45547 6.66823 3.0888C6.73823 2.5663 6.89323 2.0938 7.2724 1.7138C7.6524 1.33464 8.1249 1.18047 8.6474 1.10964C9.14323 1.04297 9.76823 1.04297 10.5166 1.04297ZM7.85323 4.37797C8.16823 4.3763 8.49906 4.3763 8.84656 4.3763H12.2732C12.6207 4.3763 12.9516 4.3763 13.2666 4.37797C13.2632 3.90297 13.2516 3.54464 13.2132 3.25547C13.1607 2.8713 13.0716 2.7063 12.9632 2.59797C12.8549 2.48964 12.6899 2.40047 12.3049 2.34797C11.9032 2.29464 11.3632 2.29297 10.5599 2.29297C9.75656 2.29297 9.21656 2.29464 8.81406 2.3488C8.4299 2.40047 8.2649 2.48964 8.15656 2.5988C8.04823 2.70714 7.95906 2.8713 7.90656 3.25547C7.86823 3.5438 7.85656 3.90214 7.85323 4.37797ZM5.31823 5.74297C4.4799 5.85547 3.99656 6.06714 3.64323 6.41964C3.29156 6.77214 3.0799 7.25547 2.9674 8.0938C2.8524 8.94964 2.85073 10.0788 2.85073 11.668C2.85073 13.2571 2.8524 14.3863 2.9674 15.243C3.0799 16.0805 3.29156 16.5638 3.64406 16.9163C3.99656 17.2688 4.4799 17.4805 5.31823 17.593C6.1749 17.708 7.30323 17.7096 8.8924 17.7096H12.2257C13.8149 17.7096 14.9441 17.708 15.8007 17.593C16.6382 17.4805 17.1216 17.2688 17.4741 16.9163C17.8266 16.5638 18.0382 16.0805 18.1507 15.2421C18.2657 14.3863 18.2674 13.2571 18.2674 11.668C18.2674 10.0788 18.2657 8.95047 18.1507 8.09297C18.0382 7.25547 17.8266 6.77214 17.4741 6.41964C17.1216 6.06714 16.6382 5.85547 15.7999 5.74297C14.9441 5.62797 13.8149 5.6263 12.2257 5.6263H8.8924C7.30323 5.6263 6.17573 5.62797 5.31823 5.74297ZM10.5599 7.70964C10.7257 7.70964 10.8846 7.77548 11.0018 7.89269C11.119 8.0099 11.1849 8.16887 11.1849 8.33464V8.34297C12.0924 8.5713 12.8516 9.28714 12.8516 10.2788C12.8516 10.4446 12.7857 10.6035 12.6685 10.7207C12.5513 10.838 12.3923 10.9038 12.2266 10.9038C12.0608 10.9038 11.9018 10.838 11.7846 10.7207C11.6674 10.6035 11.6016 10.4446 11.6016 10.2788C11.6016 9.9588 11.2466 9.51547 10.5599 9.51547C9.87323 9.51547 9.51823 9.9588 9.51823 10.2788C9.51823 10.5988 9.87323 11.043 10.5599 11.043C11.7141 11.043 12.8516 11.843 12.8516 13.0571C12.8516 14.0488 12.0924 14.7638 11.1849 14.993V15.0013C11.1849 15.1671 11.119 15.326 11.0018 15.4432C10.8846 15.5605 10.7257 15.6263 10.5599 15.6263C10.3941 15.6263 10.2352 15.5605 10.118 15.4432C10.0007 15.326 9.9349 15.1671 9.9349 15.0013V14.993C9.0274 14.7646 8.26823 14.0488 8.26823 13.0571C8.26823 12.8914 8.33408 12.7324 8.45129 12.6152C8.5685 12.498 8.72747 12.4321 8.89323 12.4321C9.05899 12.4321 9.21796 12.498 9.33517 12.6152C9.45238 12.7324 9.51823 12.8914 9.51823 13.0571C9.51823 13.3771 9.87323 13.8205 10.5599 13.8205C11.2466 13.8205 11.6016 13.3771 11.6016 13.0571C11.6016 12.7371 11.2466 12.293 10.5599 12.293C9.40573 12.293 8.26823 11.493 8.26823 10.2788C8.26823 9.28714 9.0274 8.5713 9.9349 8.34297V8.33464C9.9349 8.16887 10.0007 8.0099 10.118 7.89269C10.2352 7.77548 10.3941 7.70964 10.5599 7.70964Z"
          fill="#717171"
        />
      </svg>
    ),
    type: "multiple",
    optionsFromData: true,
  },
  {
    label: "Discount code",
    accessor: "discountCode",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        viewBox="0 0 16 16"
        fill="none"
      >
        <g clipPath="url(#clip0_11614_15279)">
          <path
            d="M5.17259 10.8289L10.8869 5.11465M6.66287 1.14208C7.0491 0.827823 7.53181 0.65625 8.02973 0.65625C8.52765 0.65625 9.01036 0.827823 9.39659 1.14208L9.77716 1.45179L10.2606 1.37408C10.7523 1.2949 11.2562 1.38761 11.6876 1.63658C12.1189 1.88555 12.4512 2.27557 12.6286 2.74093L12.8023 3.19808L13.2606 3.37293C13.7262 3.5501 14.1164 3.88235 14.3656 4.3137C14.6148 4.74504 14.7077 5.2491 14.6286 5.74093L14.5509 6.22436L14.8594 6.60493C15.1737 6.99116 15.3453 7.47387 15.3453 7.97179C15.3453 8.46971 15.1737 8.95243 14.8594 9.33865L14.5509 9.71922L14.6286 10.2026C14.7078 10.6943 14.6151 11.1983 14.3661 11.6296C14.1171 12.0609 13.7271 12.3933 13.2617 12.5706L12.8046 12.7455L12.6297 13.2026C12.4524 13.668 12.12 14.058 11.6887 14.307C11.2574 14.556 10.7534 14.6487 10.2617 14.5695L9.7783 14.4918L9.39773 14.8015C9.01151 15.1158 8.52879 15.2873 8.03087 15.2873C7.53295 15.2873 7.05024 15.1158 6.66402 14.8015L6.28345 14.4929L5.80002 14.5695C5.30833 14.6487 4.80437 14.556 4.37305 14.307C3.94173 14.058 3.60939 13.668 3.43202 13.2026L3.25716 12.7455L2.80002 12.5706C2.33465 12.3933 1.94463 12.0609 1.69566 11.6296C1.44669 11.1983 1.35399 10.6943 1.43316 10.2026L1.51087 9.71922L1.20116 9.33865C0.886905 8.95243 0.715332 8.46971 0.715332 7.97179C0.715332 7.47387 0.886905 6.99116 1.20116 6.60493L1.50973 6.22436L1.43316 5.74093C1.35391 5.24938 1.44645 4.74554 1.6952 4.31424C1.94395 3.88293 2.33372 3.55051 2.79887 3.37293L3.25602 3.19922L3.43087 2.74093C3.60804 2.27535 3.94029 1.88508 4.37164 1.6359C4.80298 1.38671 5.30704 1.29384 5.79887 1.37293L6.2823 1.45065L6.66287 1.14208Z"
            stroke="#717171"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.74404 6.25614C5.89559 6.25614 6.04093 6.19593 6.1481 6.08877C6.25526 5.98161 6.31546 5.83626 6.31546 5.68471C6.31546 5.53316 6.25526 5.38781 6.1481 5.28065C6.04093 5.17349 5.89559 5.11328 5.74404 5.11328C5.59248 5.11328 5.44714 5.17349 5.33998 5.28065C5.23281 5.38781 5.17261 5.53316 5.17261 5.68471C5.17261 5.83626 5.23281 5.98161 5.33998 6.08877C5.44714 6.19593 5.59248 6.25614 5.74404 6.25614ZM10.3155 10.8276C10.467 10.8276 10.6124 10.7674 10.7195 10.6602C10.8267 10.553 10.8869 10.4077 10.8869 10.2561C10.8869 10.1046 10.8267 9.95924 10.7195 9.85208C10.6124 9.74491 10.467 9.68471 10.3155 9.68471C10.1639 9.68471 10.0186 9.74491 9.9114 9.85208C9.80424 9.95924 9.74404 10.1046 9.74404 10.2561C9.74404 10.4077 9.80424 10.553 9.9114 10.6602C10.0186 10.7674 10.1639 10.8276 10.3155 10.8276Z"
            stroke="#717171"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_11614_15279">
            <rect width={16} height={16} fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    optionsFromData: true,
    type: "multiple",
  },
];

export default function All() {
  const [shownColumns, setShownColumns] = useState<string[]>([
    "event",
    "userId",
    "transactionReference",
    "created_at",
    "attendees",
    "currency",
    "amountPaid",
    "select",
  ]);
  const { billings, isLoading } = useGetBillings({ userId: 1 });
  const { filteredData, filters, selectedFilters, applyFilter, setOptions } =
    useFilter<TEventTransaction>({
      data: billings,
      dataFilters: billingsFilter,
    });

  console.log(filteredData, billings);

  useEffect(() => {
    if (isLoading) return;

    filters
      .filter((filter) => filter.optionsFromData)
      .forEach(({ accessor }) => {
        setOptions(
          accessor,
          extractUniqueTypes<TEventTransaction>(billings, accessor)
        );
      });
  }, [isLoading]);

  console.log(billings);

  const onChange = (accessorKey) =>
    setShownColumns((prevShown) =>
      prevShown.includes(accessorKey)
        ? prevShown.filter((item) => item !== accessorKey)
        : [...prevShown, accessorKey]
    );

  return (
    <section className="space-y-6 max-w-full">
      <div className="flex justify-end gap-4">
        <div className="px-4 py-2 flex flex-col gap-2 bg-gray-100 border-gray-200 border-2 rounded-md">
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
          <span className="text-gray-900 font-semibold text-2xl">₦100,000</span>
          <div className="text-tiny text-green-500 flex items-center gap-1.5 p-1 rounded bg-green-50 w-fit">
            <span className="font-medium capitalize">Wallet: #90,000</span>
          </div>
        </div>
        <div className="px-4 py-2 flex flex-col gap-2 bg-gray-100 border-gray-200 border-2 rounded-md">
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
          <span className="text-gray-900 font-semibold text-2xl">₦35,000</span>
        </div>
        <div className="px-4 py-2 flex flex-col gap-2 bg-gray-100 border-gray-200 border-2 rounded-md">
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
          <span className="text-gray-900 font-semibold text-2xl">50</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-gray-500 font-medium text-sm">
            2/10 Transactions selected
          </span>
          <div className="flex gap-4">
            <Button className="bg-basePrimary w-full">Request Payout</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-white border-[1px] border-basePrimary text-basePrimary flex gap-2 items-center">
                  <span>More Column Options</span>{" "}
                  <AngleDown className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 space-y-4 px-4 h-[500px] hide-scrollbar overflow-auto">
                {columns
                  .filter((column) => column?.id !== "select")
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
        <Filter<TEventTransaction>
          className={`space-y-4 max-w-full`}
          filters={filters}
          applyFilter={applyFilter}
          selectedFilters={selectedFilters}
        />
        <div className="space-y-2 max-w-full">
          <DataTable
            columns={columns.filter(
              ({ accessorKey, id }) =>
                shownColumns.includes(accessorKey) || shownColumns.includes(id)
            )}
            data={filteredData}
          />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  );
}
