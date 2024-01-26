import Filter from "@/components/Filter";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useFilter } from "@/hooks/common/useFilter";
import { TAttendee } from "@/types/attendee";
import { TFilter } from "@/types/filter";
import { isWithinTimeRange } from "@/utils/date";
import { extractUniqueTypes } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { TTag } from "@/types/tags";
import { TAttendeeTags } from "@/types/tags";
import { TFavouriteContact } from "@/types/favourites";

export default function ViewAttendeesSection({
  attendees,
  toggleValue,
  selectedAttendees,
  attendeesTags,
  favourites,
}: {
  attendees: TAttendee[];
  selectedAttendees: TAttendee[];
  toggleValue: (value: TAttendee | TAttendee[]) => void;
  attendeesTags: TAttendeeTags[];
  favourites: TFavouriteContact;
}) {
  const attendeeFilter: TFilter<TAttendee>[] = [
    {
      label: "checked-in",
      accessor: "checkin",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M5.33333 8.32312L8.162 11.1518L13.818 5.49512M2 8.32312L4.82867 11.1518M10.4853 5.49512L8.33333 7.66645"
            stroke="#CFCFCF"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      options: [
        { label: "07/01/2024", value: "01/07/2024" },
        { label: "08/01/2024", value: "01/08/2024" },
        { label: "09/01/2024", value: "01/09/2024" },
      ],
      onFilter: (attendee: TAttendee, date: string[]) => {
        return date.some(
          (compareDate) =>
            attendee.checkin &&
            attendee.checkin.find(({ date }) => {
              return isWithinTimeRange(date, compareDate);
            })
        );
      },
      type: "multiple",
    },
    {
      label: "ticket type",
      accessor: "ticketType",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.5 7C14.6326 7 14.7598 6.94732 14.8536 6.85355C14.9473 6.75979 15 6.63261 15 6.5V4C15 3.73478 14.8946 3.48043 14.7071 3.29289C14.5196 3.10536 14.2652 3 14 3H2C1.73478 3 1.48043 3.10536 1.29289 3.29289C1.10536 3.48043 1 3.73478 1 4V6.5C1 6.63261 1.05268 6.75979 1.14645 6.85355C1.24021 6.94732 1.36739 7 1.5 7C1.76522 7 2.01957 7.10536 2.20711 7.29289C2.39464 7.48043 2.5 7.73478 2.5 8C2.5 8.26522 2.39464 8.51957 2.20711 8.70711C2.01957 8.89464 1.76522 9 1.5 9C1.36739 9 1.24021 9.05268 1.14645 9.14645C1.05268 9.24021 1 9.36739 1 9.5V12C1 12.2652 1.10536 12.5196 1.29289 12.7071C1.48043 12.8946 1.73478 13 2 13H14C14.2652 13 14.5196 12.8946 14.7071 12.7071C14.8946 12.5196 15 12.2652 15 12V9.5C15 9.36739 14.9473 9.24021 14.8536 9.14645C14.7598 9.05268 14.6326 9 14.5 9C14.2348 9 13.9804 8.89464 13.7929 8.70711C13.6054 8.51957 13.5 8.26522 13.5 8C13.5 7.73478 13.6054 7.48043 13.7929 7.29289C13.9804 7.10536 14.2348 7 14.5 7ZM14 9.935V12H10.5V10.5H9.5V12H2V9.935C2.428 9.82314 2.80683 9.57253 3.07721 9.2224C3.34759 8.87227 3.49426 8.44238 3.49426 8C3.49426 7.55762 3.34759 7.12773 3.07721 6.7776C2.80683 6.42747 2.428 6.17686 2 6.065V4H9.5V5.5H10.5V4H14V6.065C13.572 6.17686 13.1932 6.42747 12.9228 6.7776C12.6524 7.12773 12.5057 7.55762 12.5057 8C12.5057 8.44238 12.6524 8.87227 12.9228 9.2224C13.1932 9.57253 13.572 9.82314 14 9.935Z"
            fill="#CFCFCF"
          />
          <path d="M9.5 6.5H10.5V9.5H9.5V6.5Z" fill="#CFCFCF" />
        </svg>
      ),
      optionsFromData: true,
      type: "multiple",
    },
    {
      label: "attendee",
      accessor: "attendeeType",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="13"
          viewBox="0 0 14 13"
          fill="none"
        >
          <path
            d="M13.3245 12.3128C12.3363 10.6053 10.7851 9.40719 8.98259 8.89907C9.85894 8.4536 10.5597 7.72596 10.9719 6.83349C11.3841 5.94102 11.4837 4.93573 11.2547 3.97972C11.0257 3.02371 10.4813 2.1727 9.70945 1.56391C8.93757 0.955113 7.98316 0.624023 7.00009 0.624023C6.01703 0.624023 5.06261 0.955113 4.29074 1.56391C3.51887 2.1727 2.97453 3.02371 2.74549 3.97972C2.51645 4.93573 2.61607 5.94102 3.02828 6.83349C3.44048 7.72596 4.14125 8.4536 5.01759 8.89907C3.21509 9.40656 1.66384 10.6047 0.675719 12.3128C0.648586 12.3555 0.630368 12.4032 0.622159 12.4531C0.613951 12.503 0.615922 12.5541 0.627955 12.6032C0.639988 12.6523 0.661832 12.6985 0.692176 12.739C0.722519 12.7794 0.760734 12.8133 0.804521 12.8387C0.848308 12.864 0.896762 12.8802 0.946969 12.8863C0.997176 12.8924 1.0481 12.8882 1.09667 12.8741C1.14524 12.8601 1.19046 12.8363 1.22961 12.8043C1.26876 12.7722 1.30103 12.7326 1.32447 12.6878C2.52509 10.6134 4.64634 9.37531 7.00009 9.37531C9.35384 9.37531 11.4751 10.6134 12.6757 12.6878C12.6992 12.7326 12.7314 12.7722 12.7706 12.8043C12.8097 12.8363 12.8549 12.8601 12.9035 12.8741C12.9521 12.8882 13.003 12.8924 13.0532 12.8863C13.1034 12.8802 13.1519 12.864 13.1957 12.8387C13.2395 12.8133 13.2777 12.7794 13.308 12.739C13.3384 12.6985 13.3602 12.6523 13.3722 12.6032C13.3843 12.5541 13.3862 12.503 13.378 12.4531C13.3698 12.4032 13.3516 12.3555 13.3245 12.3128ZM3.37509 5.00031C3.37509 4.28336 3.5877 3.5825 3.98602 2.98637C4.38434 2.39024 4.95048 1.92562 5.61287 1.65125C6.27525 1.37688 7.00411 1.3051 7.7073 1.44497C8.41048 1.58484 9.05639 1.93009 9.56336 2.43705C10.0703 2.94402 10.4156 3.58993 10.5554 4.29311C10.6953 4.99629 10.6235 5.72516 10.3492 6.38754C10.0748 7.04992 9.61016 7.61607 9.01404 8.01439C8.41791 8.41271 7.71705 8.62531 7.00009 8.62531C6.03904 8.62416 5.11768 8.24187 4.43811 7.5623C3.75854 6.88273 3.37625 5.96137 3.37509 5.00031Z"
            fill="#CFCFCF"
          />
        </svg>
      ),
      optionsFromData: true,
      type: "multiple",
    },
    {
      label: "favourite",
      accessor: "favourite",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
        >
          <g clipPath="url(#clip0_11614_6929)">
            <path
              d="M8.00059 14.4131C7.90239 14.4128 7.80706 14.38 7.72948 14.3198C5.25837 12.3998 3.55615 10.7464 2.36504 9.11532C0.845037 7.03087 0.49837 5.10643 1.33393 3.39532C1.92948 2.17309 3.64059 1.17309 5.64059 1.75532C6.59416 2.03076 7.42614 2.62144 8.00059 3.43087C8.57504 2.62144 9.40702 2.03076 10.3606 1.75532C12.3561 1.18198 14.0717 2.17309 14.6673 3.39532C15.5028 5.10643 15.1561 7.03087 13.6361 9.11532C12.445 10.7464 10.7428 12.3998 8.2717 14.3198C8.19413 14.38 8.09879 14.4128 8.00059 14.4131ZM4.50281 2.47976C4.02693 2.46124 3.55498 2.57267 3.13763 2.80209C2.72029 3.03152 2.3733 3.37027 2.13393 3.78198C1.44504 5.19532 1.75615 6.76865 3.08504 8.58643C4.49729 10.408 6.151 12.0288 8.00059 13.4042C9.84989 12.0302 11.5036 10.4109 12.9161 8.59087C14.2495 6.76865 14.5561 5.19532 13.8673 3.78643C13.4228 2.89754 12.0895 2.19087 10.605 2.60865C10.1291 2.74932 9.6878 2.98808 9.30966 3.30957C8.93153 3.63106 8.62489 4.02816 8.40948 4.47532C8.376 4.55683 8.31903 4.62655 8.24583 4.67562C8.17263 4.72469 8.08649 4.75089 7.99837 4.75089C7.91024 4.75089 7.82411 4.72469 7.75091 4.67562C7.67771 4.62655 7.62074 4.55683 7.58726 4.47532C7.37347 4.02704 7.06736 3.62902 6.68899 3.30732C6.31062 2.98563 5.86853 2.74754 5.3917 2.60865C5.1028 2.52474 4.80365 2.48136 4.50281 2.47976Z"
              fill="#D6D6D6"
            />
          </g>
          <defs>
            <clipPath id="clip0_11614_6929">
              <rect width={16} height={16} fill="white" />
            </clipPath>
          </defs>
        </svg>
      ),
      options: [
        { label: "favourite", value: true },
        { label: "not favourite", value: false },
      ],
      onFilter: (attendee: TAttendee, isFavourite: boolean) =>
        !!favourites.attendees &&
        (isFavourite
          ? favourites.attendees.includes(attendee.id)
          : !favourites.attendees.includes(attendee.id)),
    },
    {
      label: "tags",
      accessor: "tags",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.84012 2.6665H12.5723C12.9765 2.6665 13.364 2.82705 13.6498 3.11282C13.9356 3.39859 14.0961 3.78617 14.0961 4.19031V6.9225C14.0961 7.12456 14.0158 7.31832 13.8729 7.46117L8.69727 12.6368C8.41151 12.9225 8.02399 13.0829 7.61993 13.0829C7.21587 13.0829 6.82836 12.9225 6.5426 12.6368L4.12584 10.22C3.84017 9.93427 3.67969 9.54675 3.67969 9.14269C3.67969 8.73863 3.84017 8.35112 4.12584 8.06536L9.30146 2.88974C9.44431 2.74685 9.63807 2.66655 9.84012 2.6665Z"
            stroke="#D6D6D6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.47713 12.5714L4.94342 13.3379C4.75243 13.4334 4.5435 13.4877 4.33018 13.4972C4.11686 13.5068 3.90391 13.4715 3.70513 13.3934C3.50636 13.3154 3.3262 13.1965 3.17634 13.0444C3.02648 12.8923 2.91026 12.7103 2.83523 12.5104L1.60475 9.22967C1.47664 8.88788 1.47547 8.51147 1.60146 8.1689C1.72744 7.82632 1.9722 7.54035 2.29123 7.363L8.00094 4.19043"
            stroke="#D6D6D6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12.9535 4.57148C12.9535 4.15069 12.6124 3.80957 12.1916 3.80957C11.7708 3.80957 11.4297 4.15069 11.4297 4.57148C11.4297 4.99226 11.7708 5.33338 12.1916 5.33338C12.6124 5.33338 12.9535 4.99226 12.9535 4.57148Z"
            fill="#D6D6D6"
          />
        </svg>
      ),
      options: extractUniqueTypes<TTag>(
        attendeesTags?.flatMap((attendee) =>
          attendee?.attendeeTags?.map((tag) => tag)
        ) || [],
        "label"
      ),
      onFilter: (attendee: TAttendee, selectedTags: string[]) => {
        const attendeeTags = attendeesTags.find((attendeeTag) => {
          console.log(attendeeTag);
          return attendeeTag.attendeeId === attendee.id;
        });

        console.log(
          attendeesTags,
          attendeeTags,
          "tags",
          attendee,
          "attendee",
          selectedTags,
          "selectedtags"
        );
        if (!attendeeTags) return false;

        return attendeeTags.attendeeTags.some(({ label }) =>
          selectedTags.includes(label)
        );
      },
      type: "multiple",
    },
  ];

  const {
    filteredData: mappedAttendees,
    filters,
    selectedFilters,
    applyFilter,
    setOptions,
  } = useFilter<TAttendee>({
    data: attendees,
    dataFilters: attendeeFilter,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    // if () return;

    filters
      .filter((filter) => filter.optionsFromData)
      .forEach(({ accessor }) => {
        setOptions(
          accessor,
          extractUniqueTypes<TAttendee>(attendees, accessor)
        );
      });
    // setOptions(
    //   "tags",
    //   (() => {
    //     const tags = attendeesTags.flatMap((attendee) =>
    //       attendee.attendeeTags.map((tag) => tag)
    //     );

    //     return extractUniqueTypes<TTag>(tags || [], "label");
    //   })()
    // );
  }, []);

  // useEffect(() => {
  //   setOptions(
  //     "tags",
  //     (() => {
  //       const tags = attendeesTags.flatMap((attendee) =>
  //         attendee.attendeeTags.map((tag) => tag)
  //       );

  //       return extractUniqueTypes<TTag>(tags || [], "label");
  //     })()
  //   );
  // }, []);

  // useEffect(() => {
  //   setMappedAttendees(
  //     attendees.filter(
  //       ({ firstName, lastName }) =>
  //         firstName.toLowerCase().includes(searchTerm) ||
  //         lastName.toLowerCase().includes(searchTerm)
  //     )
  //   );
  // }, [attendees, selectedFilters, searchTerm]);

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <svg
            className="absolute left-2 top-[25%]"
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M16.5 16.5L11.5 11.5M1.5 7.33333C1.5 8.09938 1.65088 8.85792 1.94404 9.56565C2.23719 10.2734 2.66687 10.9164 3.20854 11.4581C3.75022 11.9998 4.39328 12.4295 5.10101 12.7226C5.80875 13.0158 6.56729 13.1667 7.33333 13.1667C8.09938 13.1667 8.85792 13.0158 9.56565 12.7226C10.2734 12.4295 10.9164 11.9998 11.4581 11.4581C11.9998 10.9164 12.4295 10.2734 12.7226 9.56565C13.0158 8.85792 13.1667 8.09938 13.1667 7.33333C13.1667 6.56729 13.0158 5.80875 12.7226 5.10101C12.4295 4.39328 11.9998 3.75022 11.4581 3.20854C10.9164 2.66687 10.2734 2.23719 9.56565 1.94404C8.85792 1.65088 8.09938 1.5 7.33333 1.5C6.56729 1.5 5.80875 1.65088 5.10101 1.94404C4.39328 2.23719 3.75022 2.66687 3.20854 3.20854C2.66687 3.75022 2.23719 4.39328 1.94404 5.10101C1.65088 5.80875 1.5 6.56729 1.5 7.33333Z"
              stroke="#717171"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Input
            type="email"
            placeholder="Search attendees"
            onInput={(event) => setSearchTerm(event.target.value)}
            className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 bg-gray-50 rounded-2xl pl-8"
          />
          <svg
            className="absolute right-2 top-[25%]"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 3.75V7.5C21 7.69891 20.921 7.88968 20.7803 8.03033C20.6397 8.17098 20.4489 8.25 20.25 8.25C20.0511 8.25 19.8603 8.17098 19.7197 8.03033C19.579 7.88968 19.5 7.69891 19.5 7.5V4.5H16.5C16.3011 4.5 16.1103 4.42098 15.9697 4.28033C15.829 4.13968 15.75 3.94891 15.75 3.75C15.75 3.55109 15.829 3.36032 15.9697 3.21967C16.1103 3.07902 16.3011 3 16.5 3H20.25C20.4489 3 20.6397 3.07902 20.7803 3.21967C20.921 3.36032 21 3.55109 21 3.75ZM7.5 19.5H4.5V16.5C4.5 16.3011 4.42098 16.1103 4.28033 15.9697C4.13968 15.829 3.94891 15.75 3.75 15.75C3.55109 15.75 3.36032 15.829 3.21967 15.9697C3.07902 16.1103 3 16.3011 3 16.5V20.25C3 20.4489 3.07902 20.6397 3.21967 20.7803C3.36032 20.921 3.55109 21 3.75 21H7.5C7.69891 21 7.88968 20.921 8.03033 20.7803C8.17098 20.6397 8.25 20.4489 8.25 20.25C8.25 20.0511 8.17098 19.8603 8.03033 19.7197C7.88968 19.579 7.69891 19.5 7.5 19.5ZM20.25 15.75C20.0511 15.75 19.8603 15.829 19.7197 15.9697C19.579 16.1103 19.5 16.3011 19.5 16.5V19.5H16.5C16.3011 19.5 16.1103 19.579 15.9697 19.7197C15.829 19.8603 15.75 20.0511 15.75 20.25C15.75 20.4489 15.829 20.6397 15.9697 20.7803C16.1103 20.921 16.3011 21 16.5 21H20.25C20.4489 21 20.6397 20.921 20.7803 20.7803C20.921 20.6397 21 20.4489 21 20.25V16.5C21 16.3011 20.921 16.1103 20.7803 15.9697C20.6397 15.829 20.4489 15.75 20.25 15.75ZM3.75 8.25C3.94891 8.25 4.13968 8.17098 4.28033 8.03033C4.42098 7.88968 4.5 7.69891 4.5 7.5V4.5H7.5C7.69891 4.5 7.88968 4.42098 8.03033 4.28033C8.17098 4.13968 8.25 3.94891 8.25 3.75C8.25 3.55109 8.17098 3.36032 8.03033 3.21967C7.88968 3.07902 7.69891 3 7.5 3H3.75C3.55109 3 3.36032 3.07902 3.21967 3.21967C3.07902 3.36032 3 3.55109 3 3.75V7.5C3 7.69891 3.07902 7.88968 3.21967 8.03033C3.36032 8.17098 3.55109 8.25 3.75 8.25ZM15.75 17.25H8.25C7.85218 17.25 7.47064 17.092 7.18934 16.8107C6.90804 16.5294 6.75 16.1478 6.75 15.75V8.25C6.75 7.85218 6.90804 7.47064 7.18934 7.18934C7.47064 6.90804 7.85218 6.75 8.25 6.75H15.75C16.1478 6.75 16.5294 6.90804 16.8107 7.18934C17.092 7.47064 17.25 7.85218 17.25 8.25V15.75C17.25 16.1478 17.092 16.5294 16.8107 16.8107C16.5294 17.092 16.1478 17.25 15.75 17.25ZM8.25 15.75H15.75V8.25H8.25V15.75Z"
              fill="#717171"
            />
          </svg>
        </div>
        <Filter
          className={"my-4 space-y-4"}
          filters={filters}
          applyFilter={applyFilter}
          selectedFilters={selectedFilters}
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            className="data-[state=checked]:bg-basePrimary"
            id="terms2"
            onCheckedChange={() =>
              toggleValue(
                selectedAttendees.length === 0 ||
                  (mappedAttendees.some((attendee) =>
                    selectedAttendees.includes(attendee)
                  ) &&
                    !mappedAttendees.every((attendee) =>
                      selectedAttendees.includes(attendee)
                    ))
                  ? mappedAttendees.map((attendee) => attendee)
                  : []
              )
            }
            checked={mappedAttendees.every((attendee) =>
              selectedAttendees.includes(attendee)
            )}
          />
          <label
            htmlFor="terms2"
            className="text-gray-500 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <p className="text-xs text-gray-500">
              {
                mappedAttendees.filter(
                  ({ firstName, lastName }) =>
                    firstName.toLowerCase().includes(searchTerm) ||
                    lastName.toLowerCase().includes(searchTerm)
                ).length
              }{" "}
              attendees listed in your view
            </p>
          </label>
        </div>
        <div className="space-y-4 max-h-32 overflow-auto">
          {mappedAttendees
            .filter(
              ({ firstName, lastName }) =>
                firstName.toLowerCase().includes(searchTerm) ||
                lastName.toLowerCase().includes(searchTerm)
            )
            .map((attendee) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="data-[state=checked]:bg-basePrimary"
                  id="terms2"
                  onCheckedChange={() => toggleValue(attendee)}
                  checked={selectedAttendees.includes(attendee)}
                />
                <label
                  htmlFor="terms2"
                  className="capitalize text-gray-500 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {attendee.firstName + " " + attendee.lastName}
                </label>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
