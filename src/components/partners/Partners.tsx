"use client";

import { Input } from "..";
import { HeaderTab } from "./_components";
import Filter from "@/components/Filter";
import { Search } from "styled-icons/evil";
import useSearch from "@/hooks/common/useSearch";
import { Sponsors } from "./sponsors/Sponsors";
import { Exhibitors } from "./sponsors/Exhibitors";
import {
  useFetchPartners,
  useFetchSingleEvent,
  useVerifyUserAccess,
  useCheckTeamMember,
} from "@/hooks";
import { useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { extractUniqueTypes } from "@/utils/helpers";
import { TFilter } from "@/types/filter";
import { TExPartner, Event } from "@/types";
import { useFilter } from "@/hooks";
import _ from "lodash";
import { cn } from "@/lib";

export function Partners({ eventId }: { eventId: string }) {
  const { data, loading, refetch } = useFetchPartners(eventId);
  const { data: event } = useFetchSingleEvent(eventId);
  const { isOrganizer } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const params = useSearchParams();
  const query = params.get("p");
  const partnersFilter: TFilter<TExPartner>[] = [
    {
      label: "Location",
      accessor: "city",
      icon: (
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.19824 1.5C5.71387 1.5 3.69824 3.41844 3.69824 5.78125C3.69824 8.5 6.69824 12.8084 7.7998 14.2966C7.84553 14.3594 7.90546 14.4105 7.9747 14.4457C8.04395 14.481 8.12054 14.4994 8.19824 14.4994C8.27594 14.4994 8.35254 14.481 8.42178 14.4457C8.49102 14.4105 8.55095 14.3594 8.59668 14.2966C9.69824 12.8091 12.6982 8.50219 12.6982 5.78125C12.6982 3.41844 10.6826 1.5 8.19824 1.5Z"
            stroke="#D6D6D6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8.19824 7.5C9.02667 7.5 9.69824 6.82843 9.69824 6C9.69824 5.17157 9.02667 4.5 8.19824 4.5C7.36982 4.5 6.69824 5.17157 6.69824 6C6.69824 6.82843 7.36982 7.5 8.19824 7.5Z"
            stroke="#D6D6D6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      optionsFromData: true,
      type: "multiple",
      order: 1,
    },
    {
      label: "Exhibition Hall",
      accessor: "exhibitionHall",
      icon: (
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.3978 1.66797C5.80612 1.66797 2.06445 5.40964 2.06445 10.0013C2.06445 14.593 5.80612 18.3346 10.3978 18.3346C14.9895 18.3346 18.7311 14.593 18.7311 10.0013C18.7311 5.40964 14.9895 1.66797 10.3978 1.66797ZM10.3978 16.668C6.72279 16.668 3.73112 13.6763 3.73112 10.0013C3.73112 6.3263 6.72279 3.33464 10.3978 3.33464C14.0728 3.33464 17.0645 6.3263 17.0645 10.0013C17.0645 13.6763 14.0728 16.668 10.3978 16.668ZM12.8978 10.0013C12.8978 11.3846 11.7811 12.5013 10.3978 12.5013C9.01445 12.5013 7.89779 11.3846 7.89779 10.0013C7.89779 8.61797 9.01445 7.5013 10.3978 7.5013C11.7811 7.5013 12.8978 8.61797 12.8978 10.0013Z"
            fill="#D6D6D6"
          />
        </svg>
      ),
      optionsFromData: true,
      type: "multiple",
      order: 3,
    },
    {
      label: "Promo",
      accessor: "offers",
      icon: (
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_13204_1537)">
            <path
              d="M5.27246 6.5C5.27246 6.6875 5.236 6.86458 5.16309 7.03125C5.09017 7.19792 4.99121 7.34375 4.86621 7.46875C4.74121 7.59375 4.59538 7.69271 4.42871 7.76562C4.26204 7.83854 4.08496 7.875 3.89746 7.875C3.70996 7.875 3.53288 7.83854 3.36621 7.76562C3.19954 7.69271 3.05371 7.59375 2.92871 7.46875C2.80371 7.34375 2.70475 7.19792 2.63184 7.03125C2.55892 6.86458 2.52246 6.6875 2.52246 6.5C2.52246 6.3125 2.55892 6.13542 2.63184 5.96875C2.70475 5.80208 2.80371 5.65625 2.92871 5.53125C3.05371 5.40625 3.19954 5.30729 3.36621 5.23438C3.53288 5.16146 3.70996 5.125 3.89746 5.125C4.08496 5.125 4.26204 5.16146 4.42871 5.23438C4.59538 5.30729 4.74121 5.40625 4.86621 5.53125C4.99121 5.65625 5.09017 5.80208 5.16309 5.96875C5.236 6.13542 5.27246 6.3125 5.27246 6.5ZM3.89746 7.125C4.06934 7.125 4.21517 7.0651 4.33496 6.94531C4.45475 6.82552 4.51725 6.67708 4.52246 6.5C4.52246 6.32812 4.46256 6.18229 4.34277 6.0625C4.22298 5.94271 4.07454 5.88021 3.89746 5.875C3.72559 5.875 3.57975 5.9349 3.45996 6.05469C3.34017 6.17448 3.27767 6.32292 3.27246 6.5C3.27246 6.67188 3.33236 6.81771 3.45215 6.9375C3.57194 7.05729 3.72038 7.11979 3.89746 7.125ZM7.89746 8.125C8.08496 8.125 8.26204 8.16146 8.42871 8.23438C8.59538 8.30729 8.74121 8.40625 8.86621 8.53125C8.99121 8.65625 9.09017 8.80208 9.16309 8.96875C9.236 9.13542 9.27246 9.3125 9.27246 9.5C9.27246 9.6875 9.236 9.86458 9.16309 10.0312C9.09017 10.1979 8.99121 10.3438 8.86621 10.4688C8.74121 10.5938 8.59538 10.6927 8.42871 10.7656C8.26204 10.8385 8.08496 10.875 7.89746 10.875C7.70996 10.875 7.53288 10.8385 7.36621 10.7656C7.19954 10.6927 7.05371 10.5938 6.92871 10.4688C6.80371 10.3438 6.70475 10.1979 6.63184 10.0312C6.55892 9.86458 6.52246 9.6875 6.52246 9.5C6.52246 9.3125 6.55892 9.13542 6.63184 8.96875C6.70475 8.80208 6.80371 8.65625 6.92871 8.53125C7.05371 8.40625 7.19954 8.30729 7.36621 8.23438C7.53288 8.16146 7.70996 8.125 7.89746 8.125ZM7.89746 10.125C8.06934 10.125 8.21517 10.0651 8.33496 9.94531C8.45475 9.82552 8.51725 9.67708 8.52246 9.5C8.52246 9.32812 8.46257 9.18229 8.34277 9.0625C8.22298 8.94271 8.07454 8.88021 7.89746 8.875C7.72559 8.875 7.57975 8.9349 7.45996 9.05469C7.34017 9.17448 7.27767 9.32292 7.27246 9.5C7.27246 9.67188 7.33236 9.81771 7.45215 9.9375C7.57194 10.0573 7.72038 10.1198 7.89746 10.125ZM6.97559 5H7.81934L4.81934 11H3.97559L6.97559 5ZM11.3975 3L16.3975 8L11.3975 13H0.397461V3H11.3975ZM10.9834 12L14.9834 8L10.9834 4H1.39746V12H10.9834ZM12.3975 7.5C12.5329 7.5 12.6501 7.54948 12.749 7.64844C12.848 7.7474 12.8975 7.86458 12.8975 8C12.8975 8.13542 12.848 8.2526 12.749 8.35156C12.6501 8.45052 12.5329 8.5 12.3975 8.5C12.262 8.5 12.1449 8.45052 12.0459 8.35156C11.9469 8.2526 11.8975 8.13542 11.8975 8C11.8975 7.86458 11.9469 7.7474 12.0459 7.64844C12.1449 7.54948 12.262 7.5 12.3975 7.5Z"
              fill="#D6D6D6"
            />
          </g>
          <defs>
            <clipPath id="clip0_13204_1537">
              <rect
                width="16"
                height="16"
                fill="white"
                transform="translate(0.397461)"
              />
            </clipPath>
          </defs>
        </svg>
      ),
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      onFilter: (partner: TExPartner, isOffer: boolean) => {
        return partner?.offers === isOffer;
      },
      type: "single",
      order: 4,
    },
    {
      label: "Job",
      accessor: "jobs",
      icon: (
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.3545 1.04297H10.4411C11.1903 1.04297 11.8145 1.04297 12.3095 1.10964C12.8328 1.17964 13.3053 1.33464 13.6845 1.7138C14.0645 2.0938 14.2195 2.5663 14.2895 3.0888C14.3395 3.45547 14.352 3.89214 14.3553 4.39714C14.8953 4.41464 15.377 4.44714 15.8053 4.5038C16.782 4.63547 17.5728 4.91214 18.197 5.53547C18.8203 6.15964 19.097 6.95047 19.2286 7.92713C19.3561 8.87713 19.3561 10.0896 19.3561 11.6213V11.7146C19.3561 13.2463 19.3561 14.4596 19.2286 15.4088C19.097 16.3855 18.8203 17.1763 18.197 17.8005C17.5728 18.4238 16.782 18.7005 15.8053 18.8321C14.8553 18.9596 13.6428 18.9596 12.1111 18.9596H8.68445C7.15279 18.9596 5.93945 18.9596 4.99029 18.8321C4.01362 18.7005 3.22279 18.4238 2.59862 17.8005C1.97529 17.1763 1.69862 16.3855 1.56695 15.4088C1.43945 14.4588 1.43945 13.2463 1.43945 11.7146V11.6213C1.43945 10.0896 1.43945 8.8763 1.56695 7.92713C1.69862 6.95047 1.97529 6.15964 2.59862 5.53547C3.22279 4.91214 4.01362 4.63547 4.99029 4.5038C5.47155 4.44421 5.95548 4.40862 6.44029 4.39714C6.44362 3.89214 6.45695 3.45547 6.50612 3.0888C6.57612 2.5663 6.73112 2.0938 7.11029 1.7138C7.49029 1.33464 7.96279 1.18047 8.48529 1.10964C8.98112 1.04297 9.60612 1.04297 10.3545 1.04297ZM7.69112 4.37797C8.00612 4.3763 8.33695 4.3763 8.68445 4.3763H12.1111C12.4586 4.3763 12.7895 4.3763 13.1045 4.37797C13.1011 3.90297 13.0895 3.54464 13.0511 3.25547C12.9986 2.8713 12.9095 2.7063 12.8011 2.59797C12.6928 2.48964 12.5278 2.40047 12.1428 2.34797C11.7411 2.29464 11.2011 2.29297 10.3978 2.29297C9.59445 2.29297 9.05445 2.29464 8.65195 2.3488C8.26779 2.40047 8.10279 2.48964 7.99445 2.5988C7.88612 2.70714 7.79695 2.8713 7.74445 3.25547C7.70612 3.5438 7.69445 3.90214 7.69112 4.37797ZM5.15612 5.74297C4.31779 5.85547 3.83445 6.06714 3.48112 6.41964C3.12945 6.77214 2.91779 7.25547 2.80529 8.0938C2.69029 8.94964 2.68862 10.0788 2.68862 11.668C2.68862 13.2571 2.69029 14.3863 2.80529 15.243C2.91779 16.0805 3.12945 16.5638 3.48195 16.9163C3.83445 17.2688 4.31779 17.4805 5.15612 17.593C6.01279 17.708 7.14112 17.7096 8.73029 17.7096H12.0636C13.6528 17.7096 14.782 17.708 15.6386 17.593C16.4761 17.4805 16.9595 17.2688 17.312 16.9163C17.6645 16.5638 17.8761 16.0805 17.9886 15.2421C18.1036 14.3863 18.1053 13.2571 18.1053 11.668C18.1053 10.0788 18.1036 8.95047 17.9886 8.09297C17.8761 7.25547 17.6645 6.77214 17.312 6.41964C16.9595 6.06714 16.4761 5.85547 15.6378 5.74297C14.782 5.62797 13.6528 5.6263 12.0636 5.6263H8.73029C7.14112 5.6263 6.01362 5.62797 5.15612 5.74297ZM10.3978 7.70964C10.5635 7.70964 10.7225 7.77548 10.8397 7.89269C10.9569 8.0099 11.0228 8.16887 11.0228 8.33464V8.34297C11.9303 8.5713 12.6895 9.28714 12.6895 10.2788C12.6895 10.4446 12.6236 10.6035 12.5064 10.7207C12.3892 10.838 12.2302 10.9038 12.0645 10.9038C11.8987 10.9038 11.7397 10.838 11.6225 10.7207C11.5053 10.6035 11.4395 10.4446 11.4395 10.2788C11.4395 9.9588 11.0845 9.51547 10.3978 9.51547C9.71112 9.51547 9.35612 9.9588 9.35612 10.2788C9.35612 10.5988 9.71112 11.043 10.3978 11.043C11.552 11.043 12.6895 11.843 12.6895 13.0571C12.6895 14.0488 11.9303 14.7638 11.0228 14.993V15.0013C11.0228 15.1671 10.9569 15.326 10.8397 15.4432C10.7225 15.5605 10.5635 15.6263 10.3978 15.6263C10.232 15.6263 10.0731 15.5605 9.95584 15.4432C9.83863 15.326 9.77279 15.1671 9.77279 15.0013V14.993C8.86529 14.7646 8.10612 14.0488 8.10612 13.0571C8.10612 12.8914 8.17197 12.7324 8.28918 12.6152C8.40639 12.498 8.56536 12.4321 8.73112 12.4321C8.89688 12.4321 9.05585 12.498 9.17306 12.6152C9.29027 12.7324 9.35612 12.8914 9.35612 13.0571C9.35612 13.3771 9.71112 13.8205 10.3978 13.8205C11.0845 13.8205 11.4395 13.3771 11.4395 13.0571C11.4395 12.7371 11.0845 12.293 10.3978 12.293C9.24362 12.293 8.10612 11.493 8.10612 10.2788C8.10612 9.28714 8.86529 8.5713 9.77279 8.34297V8.33464C9.77279 8.16887 9.83863 8.0099 9.95584 7.89269C10.0731 7.77548 10.232 7.70964 10.3978 7.70964Z"
            fill="#D6D6D6"
          />
        </svg>
      ),
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      onFilter: (partner: TExPartner, isJobs: boolean) => {
        return partner?.jobs === isJobs;
      },
      type: "single",
      order: 7,
    },
    {
      label: "StampCard",
      accessor: "stampIt",
      icon: (
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.2"
            d="M10.3639 3.3125L9.2526 8.5H7.5426L6.43135 3.3125C6.3848 3.09397 6.38766 2.86779 6.43972 2.65051C6.49178 2.43322 6.59172 2.23031 6.73225 2.0566C6.87278 1.88288 7.05034 1.74276 7.25196 1.64646C7.45358 1.55016 7.67416 1.50012 7.8976 1.5H8.8976C9.12104 1.50012 9.34162 1.55016 9.54324 1.64646C9.74486 1.74276 9.92242 1.88288 10.0629 2.0566C10.2035 2.23031 10.3034 2.43322 10.3555 2.65051C10.4075 2.86779 10.4104 3.09397 10.3639 3.3125Z"
            fill="#D6D6D6"
          />
          <path
            d="M14.3975 14C14.3975 14.1326 14.3448 14.2598 14.251 14.3536C14.1572 14.4473 14.0301 14.5 13.8975 14.5H2.89746C2.76485 14.5 2.63768 14.4473 2.54391 14.3536C2.45014 14.2598 2.39746 14.1326 2.39746 14C2.39746 13.8674 2.45014 13.7402 2.54391 13.6464C2.63768 13.5527 2.76485 13.5 2.89746 13.5H13.8975C14.0301 13.5 14.1572 13.5527 14.251 13.6464C14.3448 13.7402 14.3975 13.8674 14.3975 14ZM14.3975 9V11.5C14.3975 11.7652 14.2921 12.0196 14.1046 12.2071C13.917 12.3946 13.6627 12.5 13.3975 12.5H3.39746C3.13224 12.5 2.87789 12.3946 2.69035 12.2071C2.50282 12.0196 2.39746 11.7652 2.39746 11.5V9C2.39746 8.73478 2.50282 8.48043 2.69035 8.29289C2.87789 8.10536 3.13224 8 3.39746 8H6.92434L5.94246 3.41937C5.87993 3.12781 5.88339 2.82595 5.95259 2.53589C6.02179 2.24583 6.15497 1.97492 6.34239 1.74298C6.52982 1.51104 6.76673 1.32395 7.03579 1.19539C7.30486 1.06684 7.59926 1.00008 7.89746 1H8.89746C9.19571 0.999987 9.49019 1.06668 9.75933 1.19519C10.0285 1.32371 10.2655 1.51079 10.453 1.74274C10.6404 1.97469 10.7737 2.24563 10.8429 2.53574C10.9122 2.82584 10.9156 3.12776 10.8531 3.41937L9.87059 8H13.3975C13.6627 8 13.917 8.10536 14.1046 8.29289C14.2921 8.48043 14.3975 8.73478 14.3975 9ZM7.94684 8H8.84809L9.87496 3.20937C9.90617 3.06361 9.9044 2.91272 9.86978 2.76773C9.83515 2.62274 9.76855 2.48732 9.67485 2.37139C9.58114 2.25546 9.46271 2.16194 9.3282 2.09768C9.1937 2.03343 9.04653 2.00005 8.89746 2H7.89746C7.74834 1.99996 7.6011 2.03326 7.46652 2.09748C7.33194 2.1617 7.21342 2.2552 7.11965 2.37115C7.02587 2.48709 6.95922 2.62254 6.92456 2.76758C6.8899 2.91261 6.88811 3.06356 6.91934 3.20937L7.94684 8ZM13.3975 11.5V9H3.39746V11.5H13.3975Z"
            fill="#D6D6D6"
          />
        </svg>
      ),
      options: [
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      onFilter: (partner: TExPartner, isStamp: boolean) => {
        return partner?.stampIt === isStamp;
      },
      order: 5,
      type: "single",
    },
    {
      label: "Industry",
      accessor: "industry",
      icon: (
        <svg
          width="21"
          height="20"
          viewBox="0 0 21 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.3545 1.04297H10.4411C11.1903 1.04297 11.8145 1.04297 12.3095 1.10964C12.8328 1.17964 13.3053 1.33464 13.6845 1.7138C14.0645 2.0938 14.2195 2.5663 14.2895 3.0888C14.3395 3.45547 14.352 3.89214 14.3553 4.39714C14.8953 4.41464 15.377 4.44714 15.8053 4.5038C16.782 4.63547 17.5728 4.91214 18.197 5.53547C18.8203 6.15964 19.097 6.95047 19.2286 7.92713C19.3561 8.87713 19.3561 10.0896 19.3561 11.6213V11.7146C19.3561 13.2463 19.3561 14.4596 19.2286 15.4088C19.097 16.3855 18.8203 17.1763 18.197 17.8005C17.5728 18.4238 16.782 18.7005 15.8053 18.8321C14.8553 18.9596 13.6428 18.9596 12.1111 18.9596H8.68445C7.15279 18.9596 5.93945 18.9596 4.99029 18.8321C4.01362 18.7005 3.22279 18.4238 2.59862 17.8005C1.97529 17.1763 1.69862 16.3855 1.56695 15.4088C1.43945 14.4588 1.43945 13.2463 1.43945 11.7146V11.6213C1.43945 10.0896 1.43945 8.8763 1.56695 7.92713C1.69862 6.95047 1.97529 6.15964 2.59862 5.53547C3.22279 4.91214 4.01362 4.63547 4.99029 4.5038C5.47155 4.44421 5.95548 4.40862 6.44029 4.39714C6.44362 3.89214 6.45695 3.45547 6.50612 3.0888C6.57612 2.5663 6.73112 2.0938 7.11029 1.7138C7.49029 1.33464 7.96279 1.18047 8.48529 1.10964C8.98112 1.04297 9.60612 1.04297 10.3545 1.04297ZM7.69112 4.37797C8.00612 4.3763 8.33695 4.3763 8.68445 4.3763H12.1111C12.4586 4.3763 12.7895 4.3763 13.1045 4.37797C13.1011 3.90297 13.0895 3.54464 13.0511 3.25547C12.9986 2.8713 12.9095 2.7063 12.8011 2.59797C12.6928 2.48964 12.5278 2.40047 12.1428 2.34797C11.7411 2.29464 11.2011 2.29297 10.3978 2.29297C9.59445 2.29297 9.05445 2.29464 8.65195 2.3488C8.26779 2.40047 8.10279 2.48964 7.99445 2.5988C7.88612 2.70714 7.79695 2.8713 7.74445 3.25547C7.70612 3.5438 7.69445 3.90214 7.69112 4.37797ZM5.15612 5.74297C4.31779 5.85547 3.83445 6.06714 3.48112 6.41964C3.12945 6.77214 2.91779 7.25547 2.80529 8.0938C2.69029 8.94964 2.68862 10.0788 2.68862 11.668C2.68862 13.2571 2.69029 14.3863 2.80529 15.243C2.91779 16.0805 3.12945 16.5638 3.48195 16.9163C3.83445 17.2688 4.31779 17.4805 5.15612 17.593C6.01279 17.708 7.14112 17.7096 8.73029 17.7096H12.0636C13.6528 17.7096 14.782 17.708 15.6386 17.593C16.4761 17.4805 16.9595 17.2688 17.312 16.9163C17.6645 16.5638 17.8761 16.0805 17.9886 15.2421C18.1036 14.3863 18.1053 13.2571 18.1053 11.668C18.1053 10.0788 18.1036 8.95047 17.9886 8.09297C17.8761 7.25547 17.6645 6.77214 17.312 6.41964C16.9595 6.06714 16.4761 5.85547 15.6378 5.74297C14.782 5.62797 13.6528 5.6263 12.0636 5.6263H8.73029C7.14112 5.6263 6.01362 5.62797 5.15612 5.74297ZM10.3978 7.70964C10.5635 7.70964 10.7225 7.77548 10.8397 7.89269C10.9569 8.0099 11.0228 8.16887 11.0228 8.33464V8.34297C11.9303 8.5713 12.6895 9.28714 12.6895 10.2788C12.6895 10.4446 12.6236 10.6035 12.5064 10.7207C12.3892 10.838 12.2302 10.9038 12.0645 10.9038C11.8987 10.9038 11.7397 10.838 11.6225 10.7207C11.5053 10.6035 11.4395 10.4446 11.4395 10.2788C11.4395 9.9588 11.0845 9.51547 10.3978 9.51547C9.71112 9.51547 9.35612 9.9588 9.35612 10.2788C9.35612 10.5988 9.71112 11.043 10.3978 11.043C11.552 11.043 12.6895 11.843 12.6895 13.0571C12.6895 14.0488 11.9303 14.7638 11.0228 14.993V15.0013C11.0228 15.1671 10.9569 15.326 10.8397 15.4432C10.7225 15.5605 10.5635 15.6263 10.3978 15.6263C10.232 15.6263 10.0731 15.5605 9.95584 15.4432C9.83863 15.326 9.77279 15.1671 9.77279 15.0013V14.993C8.86529 14.7646 8.10612 14.0488 8.10612 13.0571C8.10612 12.8914 8.17197 12.7324 8.28918 12.6152C8.40639 12.498 8.56536 12.4321 8.73112 12.4321C8.89688 12.4321 9.05585 12.498 9.17306 12.6152C9.29027 12.7324 9.35612 12.8914 9.35612 13.0571C9.35612 13.3771 9.71112 13.8205 10.3978 13.8205C11.0845 13.8205 11.4395 13.3771 11.4395 13.0571C11.4395 12.7371 11.0845 12.293 10.3978 12.293C9.24362 12.293 8.10612 11.493 8.10612 10.2788C8.10612 9.28714 8.86529 8.5713 9.77279 8.34297V8.33464C9.77279 8.16887 9.83863 8.0099 9.95584 7.89269C10.0731 7.77548 10.232 7.70964 10.3978 7.70964Z"
            fill="#D6D6D6"
          />
        </svg>
      ),
      optionsFromData: true,
      type: "multiple",
      order: 6,
    },
  ];

  const formatPartners: TExPartner[] = useMemo(() => {
    if (Array.isArray(data) && data?.length > 0) {
      return isOrganizer || isIdPresent
        ? data?.map((value) => {
            return {
              ...value,
              stampIt: value?.stampIt || false,
              offers: Array.isArray(value?.offers)
                ? value?.offers?.length > 0
                : false,
              industry: value?.industry,
              jobs: Array.isArray(value?.jobs)
                ? value?.jobs?.length > 0
                : false,
            };
          })
        : data
            ?.filter(({ partnerStatus }) => partnerStatus === "active")
            .map((value) => {
              return {
                ...value,
                stampIt: value?.stampIt || false,
                offers: Array.isArray(value?.offers)
                  ? value?.offers?.length > 0
                  : false,
                industry: value?.industry,
                jobs: Array.isArray(value?.jobs)
                  ? value?.jobs?.length > 0
                  : false,
              };
            });
    } else {
      return [];
    }
  }, [data]);

  const { filteredData, filters, selectedFilters, applyFilter, setOptions } =
    useFilter<TExPartner>({
      data: formatPartners,
      dataFilters: partnersFilter,
    });

  const { searchTerm, searchedData, setSearchTerm } = useSearch<TExPartner>({
    data: filteredData || [],
    accessorKey: ["companyName"],
  });

  useEffect(() => {
    if (loading) return;

    filters
      .filter((filter) => filter.optionsFromData)
      .forEach(({ accessor }) => {
        setOptions(
          accessor,
          extractUniqueTypes<TExPartner>(formatPartners, accessor)
        );
      });
  }, [loading]);

  const sponsors = useMemo(() => {
    return searchedData.filter(
      (v) => v.partnerType.toLowerCase() === "sponsor"
    );
  }, [data, searchedData]);

  const exhibitors = useMemo(() => {
    return searchedData.filter(
      (v) => v.partnerType.toLowerCase() === "exhibitor"
    );
  }, [data, searchedData]);

  // const singleEvent = useMemo(() => {
  //   if (event !== null) {
  //     const { organization, ...restData } = event;
  //     return restData;
  //   } else {
  //     return null;
  //   }
  // }, [event]);

  return (
    <div className="w-full  pb-24">
      <HeaderTab eventId={eventId} refetch={refetch} query={query} />
      <div className="px-4 mx-auto  max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10">
      <div
        className={cn(
          "w-full flex flex-col justify-start items-start ",
          Array.isArray(filteredData) && filteredData?.length === 0 && "hidden"
        )}
      >
        <div className="parent-container relative w-full overflow-x-auto no-scrollbar">
          <div className={`min-w-[950px] flex items-start justify-between p-4`}>
            <Filter
              className={"w-[80%] space-y-2 "}
              filters={filters.sort(
                (a, b) => (a.order || Infinity) - (b.order || Infinity)
              )}
              applyFilter={applyFilter}
              selectedFilters={selectedFilters}
            />

            <div className="flex items-center">
              <div className="relative w-[18rem] h-12">
                <Search size={22} className="absolute top-3 left-2" />
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  disabled={loading}
                  onInput={(event) => setSearchTerm(event.currentTarget.value)}
                  className=" placeholder:text-sm h-12 pr-4 pl-10 w-80  focus:border-gray-500 placeholder:text-gray-300 text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {query === "sponsors" && event && (
        <Sponsors event={event} sponsors={sponsors} loading={loading} />
      )}
      {query === "exhibitors" && event && (
        <Exhibitors event={event} exhibitors={exhibitors} loading={loading} />
      )}
      </div>
    </div>
  );
}
