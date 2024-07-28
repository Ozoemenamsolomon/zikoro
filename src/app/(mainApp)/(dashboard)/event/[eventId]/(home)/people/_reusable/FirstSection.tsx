"use client";
import Attendee from "@/components/Attendee";
import Filter from "@/components/Filter";
import CertificateDialog from "@/components/moreOptionDialog/certificateDialog";
import ChangeAttendeeType from "@/components/moreOptionDialog/changeAttendeeType";
import CheckinMultiple from "@/components/moreOptionDialog/checkinMultiple";
import ImportAttendees from "@/components/moreOptionDialog/importAttendees";
import PrintBadges from "@/components/moreOptionDialog/printBadges";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useFilter } from "@/hooks/common/useFilter";
import { useUpdateAttendees } from "@/hooks/services/attendee";
import {
  useGetFavourites,
  useUpdateFavourites,
} from "@/hooks/services/favourites";
import { useGetAttendeesTags } from "@/hooks/services/tags";
import { TAttendee } from "@/types/attendee";
import { isWithinTimeRange } from "@/utils/date";
import {
  calculateAndSetMaxHeight,
  convertCamelToNormal,
  extractUniqueTypes,
} from "@/utils/helpers";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { TAttendeeTags } from "@/types/tags";
import { TFavouriteContact } from "@/types/favourites";
import { TFilter } from "@/types/filter";
import { Event, TUser } from "@/types";
import { getCookie } from "@/hooks";
import { eachDayOfInterval, format, isSameDay } from "date-fns";
import useUserStore from "@/store/globalUserStore";

type TSortorder = "asc" | "desc" | "none";

const attendeeFilter: TFilter<TAttendee>[] = [
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
    onFilter: (attendee: TAttendee, compareDate: Date[]) =>
      !!attendee.checkin &&
      attendee.checkin.some(({ date }) => {
        console.log(
          date,
          compareDate[0],
          isSameDay(compareDate[0], date),
          typeof compareDate
        );
        return isSameDay(compareDate[0], date);
      }),
    type: "multiple",
  },
];

export interface MoreOptionsProps {
  attendees: TAttendee[];
  getAttendees: () => Promise<void>;
  attendeesTags: TAttendeeTags[];
  favourites?: TFavouriteContact;
  event: Event;
}

type TMoreOptions = {
  label: string;
  Component: React.FC<MoreOptionsProps>;
};

const moreOptions: TMoreOptions[] = [
  {
    label: "check-in",
    Component: CheckinMultiple,
  },
  {
    label: "Change Attendee Type",
    Component: ChangeAttendeeType,
  },
  {
    label: "Print Badges",
    Component: PrintBadges,
  },
  {
    label: "Certificates",
    Component: CertificateDialog,
  },
  {
    label: "Import Attendees",
    Component: ImportAttendees,
  },
];

export default function FirstSection({
  onOpen,
  attendees,
  isLoading,
  getAttendees,
  onSelectAttendee,
  selectedAttendee,
  event,
}: {
  onOpen: () => void;
  attendees: TAttendee[];
  isLoading: boolean;
  getAttendees: () => Promise<void>;
  onSelectAttendee: (attendee: TAttendee) => void;
  selectedAttendee: TAttendee;
  event: Event;
}) {
  const { user, setUser } = useUserStore();
  const divRef = useRef<HTMLDivElement>(null);
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
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<TSortorder>("none");
  const [CurrentSelectedModal, setCurrentSelectedModal] =
    useState<TMoreOptions | null>(null);

  const {
    favourites,
    getFavourites,
    isLoading: favouriteIsLoading,
  } = useGetFavourites({ userId: user ? user.id : 0 });

  const {
    attendeesTags,
    isLoading: attendeesTagsIsLoading,
    getAttendeesTags,
  } = useGetAttendeesTags({ userId: user ? user.id : 0 });

  const { updateFavourites } = useUpdateFavourites({
    userId: user ? user.id : 0,
  });

  const toggleFavourites = async (id: number, isFavourite: boolean) => {
    const newFavouriteAttendees = !favourites
      ? [id]
      : isFavourite
      ? (favourites.attendees ?? []).filter((attendeeId) => id !== attendeeId)
      : [...(favourites.attendees ?? []), id];

    const payload = favourites
      ? { ...favourites, attendees: newFavouriteAttendees }
      : {
          userId: user?.id,
          userEmail: user?.userEmail,
          eventId: String(event.id),
          attendees: newFavouriteAttendees,
        };

    await updateFavourites({
      payload,
    });
    await getFavourites();
    await getAttendees();
  };

  const { updateAttendees } = useUpdateAttendees();

  useEffect(() => {
    calculateAndSetMaxHeight(divRef);
  }, [mappedAttendees]);

  // useEffect(() => {
  //   if (isLoading) return;

  //   setMappedAttendees(
  //     attendees
  //       .filter(
  //         ({ firstName, lastName, organization, jobTitle }) =>
  //           firstName?.toLowerCase().includes(searchTerm) ||
  //           lastName?.toLowerCase().includes(searchTerm) ||
  //           jobTitle?.toLowerCase().includes(searchTerm) ||
  //           organization?.toLowerCase().includes(searchTerm)
  //       )
  //       .sort((a, b) =>
  //         sortOrder === "asc"
  //           ? a.firstName.localeCompare(b.firstName)
  //           : b.firstName.localeCompare(a.firstName)
  //       )
  //   );
  // }, [attendees, sortOrder, searchTerm]);

  useEffect(() => {
    if (isLoading || !event) return;

    filters
      .filter((filter) => filter.optionsFromData)
      .forEach(({ accessor }) => {
        setOptions(
          accessor,
          extractUniqueTypes<TAttendee>(attendees, accessor)
        );
      });

    setOptions(
      "checkin",
      eachDayOfInterval({
        start: event?.startDateTime,
        end: event?.endDateTime,
      }).map((date) => ({
        label: format(date, "PPP"),
        value: date,
      }))
    );
  }, [isLoading]);

  const toggleSort = () => {
    let newOrder: TSortorder;

    switch (sortOrder) {
      case "none":
        newOrder = "desc";
        break;
      case "desc":
        newOrder = "asc";
        break;
      case "asc":
        newOrder = "desc";
        break;
      default:
        newOrder = "none";
        break;
    }

    setSortOrder(newOrder);
  };

  const toggleShowFilter = () =>
    setShowFilter((prevShowFilter) => !prevShowFilter);

  const exportAttendees = () => {
    const omittedFields: (keyof TAttendee)[] = [
      "id",
      "eventId",
      "userId",
      "checkin",
      "profilePicture",
      "eventAlias",
      "bio",
      "eventRegistrationRef",
      "paymentLink",
      "registrationCompleted",
      "checkInPoints",
      "attendeeAlias",
      "attendeeProfilePoints",
      "completedFields",
      "speakingAt",
      "moderatingAt",
      "appointmentLink",
    ];

    const normalizedData = convertCamelToNormal<TAttendee>(
      mappedAttendees.map((obj) =>
        Object.keys(obj).reduce((newObj, key) => {
          if (!omittedFields.includes(key as keyof TAttendee)) {
            (newObj as any)[key] =
              key === "registrationDate"
                ? format(new Date((obj as any)[key]), "MM/dd/yyyy")
                : key === "attendeeType"
                ? obj[key].join(", ")
                : (obj as any)[key];
          }
          return newObj;
        }, {} as Partial<TAttendee>)
      ) as TAttendee[],
      " "
    );

    const worksheet = XLSX.utils.json_to_sheet(normalizedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(
      workbook,
      `attendees_${event.eventTitle}_${new Date().toISOString()}.xlsx`
    );
  };

  return (
    <>
      <div className="flex space-between justify-between border-b-[1px] border-[#F3F3F3] py-4 md:py-2 px-2">
        <h1 className="font-semibold leading-normal text-greyBlack ">
          Attendees
        </h1>
        {user && String(event?.createdBy) === String(user.id) && (
          <div className="flex gap-4 items-center">
            <button
              onClick={() => {
                onSelectAttendee(null);
                onOpen();
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.54 13V16C10.54 16.2833 10.636 16.521 10.828 16.713C11.02 16.905 11.2574 17.0007 11.54 17C11.8234 17 12.061 16.904 12.253 16.712C12.445 16.52 12.5407 16.2827 12.54 16V13H15.54C15.8234 13 16.061 12.904 16.253 12.712C16.445 12.52 16.5407 12.2827 16.54 12C16.54 11.7167 16.444 11.479 16.252 11.287C16.06 11.095 15.8227 10.9993 15.54 11H12.54V8C12.54 7.71667 12.444 7.479 12.252 7.287C12.06 7.095 11.8227 6.99933 11.54 7C11.2567 7 11.019 7.096 10.827 7.288C10.635 7.48 10.5394 7.71733 10.54 8V11H7.54004C7.25671 11 7.01904 11.096 6.82704 11.288C6.63504 11.48 6.53937 11.7173 6.54004 12C6.54004 12.2833 6.63604 12.521 6.82804 12.713C7.02004 12.905 7.25737 13.0007 7.54004 13H10.54ZM11.54 22C10.1567 22 8.85671 21.7373 7.64004 21.212C6.42337 20.6867 5.36504 19.9743 4.46504 19.075C3.56504 18.175 2.85271 17.1167 2.32804 15.9C1.80337 14.6833 1.54071 13.3833 1.54004 12C1.54004 10.6167 1.80271 9.31667 2.32804 8.1C2.85337 6.88333 3.56571 5.825 4.46504 4.925C5.36504 4.025 6.42337 3.31267 7.64004 2.788C8.85671 2.26333 10.1567 2.00067 11.54 2C12.9234 2 14.2234 2.26267 15.44 2.788C16.6567 3.31333 17.715 4.02567 18.615 4.925C19.515 5.825 20.2277 6.88333 20.753 8.1C21.2784 9.31667 21.5407 10.6167 21.54 12C21.54 13.3833 21.2774 14.6833 20.752 15.9C20.2267 17.1167 19.5144 18.175 18.615 19.075C17.715 19.975 16.6567 20.6877 15.44 21.213C14.2234 21.7383 12.9234 22.0007 11.54 22ZM11.54 20C13.7734 20 15.665 19.225 17.215 17.675C18.765 16.125 19.54 14.2333 19.54 12C19.54 9.76667 18.765 7.875 17.215 6.325C15.665 4.775 13.7734 4 11.54 4C9.30671 4 7.41504 4.775 5.86504 6.325C4.31504 7.875 3.54004 9.76667 3.54004 12C3.54004 14.2333 4.31504 16.125 5.86504 17.675C7.41504 19.225 9.30671 20 11.54 20Z"
                  fill="#15161B"
                />
              </svg>
            </button>
            <button onClick={exportAttendees}>
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
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"
                      fill="black"
                    />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {moreOptions.map((option) => (
                    <DialogTrigger
                      asChild
                      onClick={() => setCurrentSelectedModal(option)}
                    >
                      <DropdownMenuItem>{option.label}</DropdownMenuItem>
                    </DialogTrigger>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent className="px-0 pt-4 pb-2">
                <DialogHeader className="px-3">
                  <DialogTitle>
                    <span className="capitalize">
                      {CurrentSelectedModal?.label}
                    </span>
                  </DialogTitle>
                </DialogHeader>
                {CurrentSelectedModal && (
                  <CurrentSelectedModal.Component
                    attendees={mappedAttendees}
                    getAttendees={getAttendees}
                    attendeesTags={attendeesTags}
                    favourites={favourites ? favourites : undefined}
                    event={event}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      <div className="flex justify-between my-2 px-2 items-center gap-1">
        <div className="relative w-fit flex-1">
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
            type="text"
            placeholder="Search attendees"
            onInput={(event) => setSearchTerm(event.currentTarget.value)}
            className="placeholder:text-sm placeholder:text-gray-200 text-gray-700 bg-gray-50 rounded-2xl pl-8 w-full"
            value={searchTerm}
          />
          <div className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">
            {searchTerm === "" ? (
              <svg
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
            ) : (
              <button
                onClick={() => setSearchTerm("")}
                className="text-lg md:text-xl font-extrabold text-gray-300 w-[24px] h-[24px] flex items-center justify-center"
              >
                x
              </button>
            )}
          </div>
        </div>
        {user && String(event?.createdBy) === String(user.id) && (
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
        )}
      </div>
      <Filter
        className={`transition-all duration-150 my-4 space-y-4 ${
          showFilter ? "h-fit" : "h-0 overflow-hidden"
        }`}
        filters={filters}
        applyFilter={applyFilter}
        selectedFilters={selectedFilters}
      />
      <div className="flex justify-between px-2 mt-4 mb-2">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 17"
            fill="none"
          >
            <path
              d="M7.03751 10.4017C7.73388 10.007 8.28003 9.39289 8.59075 8.65521C8.90147 7.91752 8.95929 7.09774 8.75519 6.32375C8.55109 5.54975 8.09655 4.86508 7.46248 4.37653C6.82841 3.88799 6.05046 3.62305 5.25001 3.62305C4.44956 3.62305 3.67161 3.88799 3.03754 4.37653C2.40347 4.86508 1.94893 5.54975 1.74483 6.32375C1.54073 7.09774 1.59855 7.91752 1.90927 8.65521C2.21999 9.39289 2.76614 10.007 3.46251 10.4017C2.17187 10.8132 1.06348 11.6587 0.325634 12.7948C0.271265 12.8781 0.252211 12.9796 0.272664 13.0769C0.293117 13.1743 0.351402 13.2595 0.434697 13.3139C0.517991 13.3682 0.619473 13.3873 0.716816 13.3668C0.814159 13.3464 0.89939 13.2881 0.953759 13.2048C1.41914 12.4893 2.05587 11.9013 2.80613 11.4943C3.5564 11.0873 4.39645 10.8741 5.25001 10.8741C6.10357 10.8741 6.94362 11.0873 7.69389 11.4943C8.44415 11.9013 9.08088 12.4893 9.54626 13.2048C9.60417 13.279 9.68788 13.3288 9.78076 13.3441C9.87363 13.3595 9.96889 13.3393 10.0476 13.2877C10.1263 13.236 10.1827 13.1567 10.2056 13.0654C10.2285 12.9741 10.2163 12.8775 10.1713 12.7948C9.4342 11.6593 8.327 10.8138 7.03751 10.4017ZM2.37501 7.24982C2.37501 6.68119 2.54363 6.12534 2.85953 5.65255C3.17544 5.17976 3.62446 4.81126 4.14979 4.59366C4.67513 4.37606 5.2532 4.31913 5.81089 4.43006C6.36859 4.54099 6.88087 4.81481 7.28294 5.21688C7.68502 5.61896 7.95883 6.13124 8.06977 6.68893C8.1807 7.24663 8.12376 7.82469 7.90616 8.35003C7.68856 8.87537 7.32007 9.32438 6.84727 9.64029C6.37448 9.9562 5.81863 10.1248 5.25001 10.1248C4.48782 10.1238 3.75713 9.8206 3.21817 9.28165C2.67922 8.7427 2.376 8.01201 2.37501 7.24982ZM15.5625 13.3123C15.4793 13.3666 15.3779 13.3857 15.2806 13.3653C15.1834 13.3449 15.0982 13.2867 15.0438 13.2036C14.5792 12.488 13.943 11.9 13.193 11.4932C12.443 11.0865 11.6032 10.8739 10.75 10.8748C10.6506 10.8748 10.5552 10.8353 10.4848 10.765C10.4145 10.6947 10.375 10.5993 10.375 10.4998C10.375 10.4004 10.4145 10.305 10.4848 10.2347C10.5552 10.1643 10.6506 10.1248 10.75 10.1248C11.1734 10.1244 11.5914 10.0305 11.9743 9.84976C12.3571 9.66905 12.6954 9.40601 12.9648 9.07944C13.2342 8.75287 13.4282 8.37083 13.5329 7.96061C13.6375 7.55038 13.6503 7.12211 13.5703 6.70637C13.4903 6.29064 13.3194 5.89771 13.0699 5.55566C12.8204 5.21361 12.4985 4.93088 12.1271 4.72766C11.7557 4.52445 11.344 4.40577 10.9214 4.38011C10.4988 4.35444 10.0758 4.42242 9.68251 4.57919C9.63671 4.59794 9.58765 4.60745 9.53816 4.60715C9.48866 4.60685 9.43972 4.59676 9.39415 4.57745C9.34858 4.55815 9.30728 4.53002 9.27263 4.49467C9.23798 4.45933 9.21067 4.41748 9.19228 4.37153C9.17388 4.32559 9.16476 4.27645 9.16545 4.22697C9.16613 4.17748 9.17661 4.12862 9.19627 4.0832C9.21593 4.03778 9.24438 3.9967 9.27999 3.96233C9.31561 3.92796 9.35767 3.90098 9.40376 3.88294C10.2568 3.54286 11.2071 3.5392 12.0627 3.87269C12.9183 4.20618 13.6154 4.85198 14.0133 5.67962C14.4112 6.50725 14.4801 7.45505 14.2062 8.33155C13.9322 9.20804 13.3359 9.94791 12.5375 10.4017C13.8282 10.8132 14.9365 11.6587 15.6744 12.7948C15.728 12.8783 15.7463 12.9797 15.7254 13.0767C15.7044 13.1737 15.6458 13.2584 15.5625 13.3123Z"
              fill="#717171"
            />
          </svg>
          <p className="text-xs text-gray-500">
            {mappedAttendees.length} attendees listed in your view
          </p>
        </div>
        <div className=" flex items-center ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="17"
            viewBox="0 0 16 17"
            fill="none"
          >
            <path
              d="M8.98002 5.52021C9.07377 5.61384 9.20085 5.66644 9.33335 5.66644C9.46585 5.66644 9.59294 5.61384 9.68669 5.52021L10.1667 5.04021V11.8335C10.1667 11.9662 10.2194 12.0933 10.3131 12.1871C10.4069 12.2809 10.5341 12.3335 10.6667 12.3335C10.7993 12.3335 10.9265 12.2809 11.0202 12.1871C11.114 12.0933 11.1667 11.9662 11.1667 11.8335V5.04021L11.6467 5.52021C11.6925 5.56934 11.7477 5.60874 11.809 5.63607C11.8703 5.66339 11.9365 5.67809 12.0037 5.67927C12.0708 5.68046 12.1375 5.66811 12.1998 5.64296C12.262 5.61781 12.3186 5.58038 12.366 5.5329C12.4135 5.48542 12.451 5.42887 12.4761 5.36661C12.5012 5.30435 12.5136 5.23766 12.5124 5.17053C12.5112 5.10339 12.4965 5.03719 12.4692 4.97585C12.4419 4.91452 12.4025 4.85932 12.3534 4.81354L11.02 3.48021C10.9263 3.38658 10.7992 3.33398 10.6667 3.33398C10.5342 3.33398 10.4071 3.38658 10.3134 3.48021L8.98002 4.81354C8.88639 4.90729 8.83379 5.03438 8.83379 5.16688C8.83379 5.29938 8.88639 5.42646 8.98002 5.52021ZM5.83335 11.9602L6.31335 11.4802C6.35913 11.4311 6.41433 11.3917 6.47566 11.3644C6.53699 11.337 6.6032 11.3223 6.67034 11.3212C6.73747 11.32 6.80416 11.3323 6.86642 11.3575C6.92868 11.3826 6.98523 11.42 7.03271 11.4675C7.08019 11.515 7.11762 11.5716 7.14277 11.6338C7.16792 11.6961 7.18027 11.7628 7.17908 11.8299C7.1779 11.897 7.1632 11.9632 7.13587 12.0246C7.10855 12.0859 7.06915 12.1411 7.02002 12.1869L5.68669 13.5202C5.59294 13.6138 5.46585 13.6664 5.33335 13.6664C5.20085 13.6664 5.07377 13.6138 4.98002 13.5202L3.64669 12.1869C3.59756 12.1411 3.55816 12.0859 3.53083 12.0246C3.50351 11.9632 3.48881 11.897 3.48763 11.8299C3.48644 11.7628 3.49879 11.6961 3.52394 11.6338C3.54909 11.5716 3.58652 11.515 3.634 11.4675C3.68147 11.42 3.73803 11.3826 3.80029 11.3575C3.86255 11.3323 3.92923 11.32 3.99637 11.3212C4.0635 11.3223 4.12971 11.337 4.19105 11.3644C4.25238 11.3917 4.30758 11.4311 4.35335 11.4802L4.83335 11.9602V5.16688C4.83335 5.03427 4.88603 4.90709 4.9798 4.81332C5.07357 4.71956 5.20075 4.66688 5.33335 4.66688C5.46596 4.66688 5.59314 4.71956 5.68691 4.81332C5.78068 4.90709 5.83335 5.03427 5.83335 5.16688V11.9602Z"
              fill="#717171"
            />
          </svg>
          <button className=" text-xs" onClick={toggleSort}>
            A - Z
          </button>
        </div>
      </div>
      <div className="overflow-auto hide-scrollbar md:pb-32" ref={divRef}>
        <div className="min-h-max">
          {mappedAttendees
            .filter(
              ({ firstName, lastName, organization, jobTitle }) =>
                firstName?.toLowerCase().includes(searchTerm) ||
                lastName?.toLowerCase().includes(searchTerm) ||
                jobTitle?.toLowerCase().includes(searchTerm) ||
                organization?.toLowerCase().includes(searchTerm)
            )
            .sort((a, b) =>
              sortOrder === "asc"
                ? a.firstName.localeCompare(b.firstName)
                : b.firstName.localeCompare(a.firstName)
            )
            .map((attendee) => (
              <Attendee
                key={attendee.id}
                attendee={attendee}
                isSelected={attendee.id === selectedAttendee?.id}
                selectAttendee={onSelectAttendee}
                getAttendees={getAttendees}
                favourites={favourites}
                favouriteIsLoading={favouriteIsLoading}
                toggleFavourites={toggleFavourites}
                event={event}
                user={user}
              />
            ))}
        </div>
      </div>
    </>
  );
}
