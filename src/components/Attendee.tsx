import { useUpdateAttendees } from "@/hooks/services/attendee";
import { Event, TUser } from "@/types";
import { TAttendee } from "@/types/attendee";
import { TFavouriteContact } from "@/types/favourites";
import { format, isToday, isWithinInterval } from "date-fns";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetData } from "@/hooks/services/request";
import { EngagementsSettings } from "@/types/engagements";
import { cn } from "@/lib";
import { CheckCircle } from "lucide-react";

type AttendeeProps = {
  attendee: TAttendee;
  isSelected: boolean;
  selectAttendee: (attendee: TAttendee) => void;
  getAttendees: () => Promise<void>;
  favourites: TFavouriteContact | null;
  toggleFavourites: (id: number, isFavourite: boolean) => Promise<void> | null;
  favouriteIsLoading: boolean;
  event: Event;
  user: TUser;
  isLead: boolean;
  contactRequests: ContactRequest[] | null;
};

const Attendee: React.FC<AttendeeProps> = ({
  attendee,
  isSelected,
  selectAttendee,
  getAttendees,
  favourites,
  toggleFavourites,
  favouriteIsLoading,
  event,
  user,
  isLead,
  contactRequests,
}) => {
  const router = useRouter();

  const {
    data: engagementsSettings,
    isLoading: engagementsSettingsIsLoading,
    getData: getEngagementsSettings,
  } = useGetData<EngagementsSettings>(
    `engagements/${event.eventAlias}/settings`
  );
  const {
    id,
    firstName,
    lastName,
    jobTitle,
    organization,
    registrationDate,
    attendeeType,
    checkin,
    profilePicture,
    checkInPoints,
    attendeeProfilePoints,
    attendeeAlias,
    archive,
    email,
  } = attendee;

  console.log(checkInPoints, firstName);

  console.log(attendeeProfilePoints, firstName, "points");
  console.log(checkInPoints, "points");

  const isFavourite =
    (favourites &&
      favourites.attendees &&
      !!favourites.attendees.find((attendeeId) => id === attendeeId)) ||
    false;

  const { updateAttendees, isLoading: updatingAttendees } =
    useUpdateAttendees();

  const recentCheckin =
    checkin &&
    checkin.length > 0 &&
    checkin.reduce((prev, current) => {
      return prev.date > current.date && current.checkin ? prev : current;
    });

  const checkCheckin = recentCheckin && isToday(recentCheckin?.date);

  const toggleCheckin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const allocatedcheckInPoints =
      engagementsSettings?.pointsAllocation["Checked in for an event"]
        ?.points ?? 0;

    console.log(allocatedcheckInPoints, checkInPoints);

    if (
      !isWithinInterval(new Date(), {
        start: event.startDateTime,
        end: event.endDateTime,
      })
    )
      return;

    const isCheckedInToday = recentCheckin && isToday(recentCheckin?.date);
    const newDate = new Date();

    const updatedCheckin = checkin
      ? isCheckedInToday
        ? checkin.filter((elm) => elm !== recentCheckin)
        : [
            ...checkin,
            {
              date: newDate,
              checkin: true,
            },
          ]
      : [
          {
            date: newDate,
            checkin: true,
          },
        ];

    const payload: TAttendee[] = [
      {
        ...attendee,
        checkin: updatedCheckin,
        checkInPoints: checkin
          ? isCheckedInToday
            ? Math.max(checkInPoints - allocatedcheckInPoints, 0)
            : checkInPoints + allocatedcheckInPoints
          : allocatedcheckInPoints,
      },
    ];

    await updateAttendees({
      payload,
      message: `Attendee ${
        recentCheckin && isToday(recentCheckin?.date)
          ? "unchecked"
          : "checked in"
      } successfully`,
    });

    await getAttendees();
  };

  const attendeeIsUser = user && email === user?.userEmail;

  return (
    <button
      className={`w-full grid grid-cols-10 items-center gap-1.5 p-1.5 border-b border-gray-100 ${
        isSelected ? "bg-[#F9FAFF]" : ""
      }`}
      onClick={() =>
        window.innerWidth > 768
          ? selectAttendee(attendee)
          : router.push(isLead ? `leads/info/${id}` : `info/${attendeeAlias}`)
      }
    >
      <div className="col-span-2">
        <Avatar className="w-12 h-12">
          <AvatarImage
            className="h-full w-full object-cover"
            src={profilePicture ?? ""}
          />
          <AvatarFallback>
            <span className="uppercase">{firstName[0] + lastName[0]}</span>
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="col-span-6">
        <div className="justify-start items-start flex flex-col gap-1 min-w-full">
          <h4
            className={cn(
              "text-gray-900 font-semibold text-sm capitalize w-full text-left flex items-center gap-x-2 truncate",
              archive && "text-red-600"
            )}
          >
            <span>{firstName + " " + lastName}</span>
            <span className="text-tiny font-medium text-gray-700 truncate w-full text-left">
              {attendeeIsUser && " (you)"}
            </span>
            {!isLead &&
              contactRequests &&
              contactRequests.find(
                (request) =>
                  (request.senderUserEmail === attendee.email ||
                    request.receiverUserEmail === attendee.email) &&
                  !attendeeIsUser &&
                  request.status === "accepted"
              ) && <CheckCircle className="w-5 h-5 text-green-600" />}
          </h4>
          <span className="text-tiny font-medium text-gray-700 truncate w-full text-left">
            {`${jobTitle ? jobTitle + ", " : ""}${organization || ""}`}
          </span>
          {user &&
            String(event?.createdBy) === String(user.id) &&
            recentCheckin && (
              <div className="flex gap-1 text-tiny text-[#717171]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 21 20"
                  fill="none"
                >
                  <path
                    d="M7.16667 10.4041L10.7025 13.94L17.7725 6.86914M3 10.4041L6.53583 13.94M13.6067 6.86914L10.9167 9.58331"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{format(recentCheckin.date, "dd . MM . yyyy")}</span>
              </div>
            )}
          <div className="flex gap-1.5 flex-wrap w-fit">
            {attendeeType &&
              (!Array.isArray(attendeeType) ? (
                <div className="py-0.5 w-[55px] px-1.5 rounded-sm bg-[#EEFAFF] text-[#2685CA] text-tiny ">
                  {attendeeType}
                </div>
              ) : (
                attendeeType
                  .filter(
                    (type) => attendeeType.length > 1 && type !== "attendee"
                  )
                  .map((type) => (
                    <div
                      key={type}
                      className="py-0.5 w-[55px] px-1.5 rounded-sm bg-[#EEFAFF] text-[#2685CA] text-tiny "
                    >
                      {type}
                    </div>
                  ))
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center col-span-2">
        {isLead ? (
          <div />
        ) : (
          <>
            <button
              className={cn(
                favouriteIsLoading ? "pulse" : "",
                archive && "hidden"
              )}
              disabled={favouriteIsLoading}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                if (!id) return;
                toggleFavourites(id, isFavourite);
              }}
            >
              {isFavourite ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={15}
                  height={14}
                  viewBox="0 0 15 14"
                  fill="none"
                >
                  <path
                    d="M14.1668 2.39532C13.5712 1.17309 11.8557 0.173093 9.8601 0.755316C8.90653 1.03076 8.07455 1.62144 7.5001 2.43087C6.92565 1.62144 6.09368 1.03076 5.1401 0.755316C3.1401 0.181982 1.42899 1.17309 0.833437 2.39532C-0.00211853 4.10643 0.344548 6.03087 1.86455 8.11532C3.05566 9.74643 4.75788 11.3998 7.22899 13.3198C7.30709 13.3807 7.40329 13.4137 7.50233 13.4137C7.60136 13.4137 7.69757 13.3807 7.77566 13.3198C10.2423 11.4042 11.949 9.7642 13.1401 8.11532C14.6557 6.03087 15.0023 4.10643 14.1668 2.39532Z"
                    fill="black"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={17}
                  height={17}
                  viewBox="0 0 17 17"
                  fill="none"
                >
                  <g clipPath="url(#clip0_12415_20812)">
                    <path
                      d="M8.5001 14.9131C8.4019 14.9128 8.30657 14.88 8.22899 14.8198C5.75788 12.8998 4.05566 11.2464 2.86455 9.61532C1.34455 7.53087 0.997882 5.60643 1.83344 3.89532C2.42899 2.67309 4.1401 1.67309 6.1401 2.25532C7.09368 2.53076 7.92565 3.12144 8.5001 3.93087C9.07455 3.12144 9.90653 2.53076 10.8601 2.25532C12.8557 1.68198 14.5712 2.67309 15.1668 3.89532C16.0023 5.60643 15.6557 7.53087 14.1357 9.61532C12.9445 11.2464 11.2423 12.8998 8.77121 14.8198C8.69364 14.88 8.5983 14.9128 8.5001 14.9131ZM5.00233 2.97976C4.52644 2.96124 4.05449 3.07267 3.63715 3.30209C3.2198 3.53152 2.87282 3.87027 2.63344 4.28198C1.94455 5.69532 2.25566 7.26865 3.58455 9.08643C4.9968 10.908 6.65051 12.5288 8.5001 13.9042C10.3494 12.5302 12.0031 10.9109 13.4157 9.09087C14.749 7.26865 15.0557 5.69532 14.3668 4.28643C13.9223 3.39754 12.589 2.69087 11.1045 3.10865C10.6286 3.24932 10.1873 3.48808 9.80917 3.80957C9.43104 4.13106 9.1244 4.52816 8.90899 4.97532C8.87551 5.05683 8.81855 5.12655 8.74534 5.17562C8.67214 5.22469 8.58601 5.25089 8.49788 5.25089C8.40976 5.25089 8.32362 5.22469 8.25042 5.17562C8.17722 5.12655 8.12025 5.05683 8.08677 4.97532C7.87298 4.52704 7.56687 4.12902 7.1885 3.80732C6.81013 3.48563 6.36804 3.24754 5.89121 3.10865C5.60231 3.02474 5.30316 2.98136 5.00233 2.97976Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_12415_20812">
                      <rect
                        width={16}
                        height={16}
                        fill="white"
                        transform="translate(0.5 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              )}
            </button>
            <button
              onClick={toggleCheckin}
              className={cn(
                "text-[8px] flex items-center gap-0.5",
                user &&
                  String(event?.createdBy) === String(user.id) &&
                  isWithinInterval(new Date(), {
                    start: event.startDateTime,
                    end: event.endDateTime,
                  }) &&
                  !archive
                  ? ""
                  : "hidden",
                checkCheckin ? "text-basePrimary" : "text-gray-700"
              )}
              disabled={engagementsSettingsIsLoading || updatingAttendees}
            >
              <div className="flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.5em"
                  height="1.5em"
                  viewBox="0 0 21 20"
                  fill="none"
                >
                  <path
                    d="M7.16667 10.4041L10.7025 13.94L17.7725 6.86914M3 10.4041L6.53583 13.94M13.6067 6.86914L10.9167 9.58331"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span>{checkCheckin ? "undo" : "Check-in"}</span>
            </button>
          </>
        )}
      </div>
    </button>
  );
};

export default Attendee;
