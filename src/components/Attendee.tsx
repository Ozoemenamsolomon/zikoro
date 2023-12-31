import { useUpdateAttendees } from "@/hooks/attendee";
import { TAttendee } from "@/types/attendee";
import { formatDate } from "@/utils/date";

type AttendeeProps = {
  attendee: TAttendee;
  isSelected: boolean;
  selectAttendee: (attendee: TAttendee) => void;
  getAttendees: () => Promise<void>;
};

const Attendee: React.FC<AttendeeProps> = ({
  attendee,
  isSelected,
  selectAttendee,
  getAttendees,
}) => {
  const {
    id,
    firstName,
    lastName,
    jobTitle,
    organization,
    registrationDate,
    attendeeType,
    checkin,
  } = attendee;

  const { updateAttendees } = useUpdateAttendees();

  const currentCheckin =
    checkin && checkin.find(({ date }) => date === new Date().toDateString());

  const toggleCheckin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const updatedCheckinValue = !currentCheckin || !currentCheckin.checkin;

    const updatedCheckin = checkin
      ? currentCheckin
        ? [
            ...checkin.filter((elm) => elm !== currentCheckin),
            { date: new Date().toDateString(), checkin: updatedCheckinValue },
          ]
        : [
            ...checkin,
            { date: new Date().toDateString(), checkin: updatedCheckinValue },
          ]
      : [{ date: new Date().toDateString(), checkin: updatedCheckinValue }];

    const payload: TAttendee[] = [{ ...attendee, checkin: updatedCheckin }];

    await updateAttendees({
      payload,
      message: `Attendee ${
        updatedCheckinValue ? "checked in" : "unchecked"
      } successfully`,
    });

    await getAttendees();
  };

  const { day, month, year } = formatDate(registrationDate);

  return (
    <button
      className={`w-full grid grid-cols-10 items-center gap-1.5 p-1.5 border-b-2 border-gray-100 ${
        isSelected ? "bg-gray-100" : ""
      }`}
      onClick={() => selectAttendee(attendee)}
    >
      <div className="col-span-2">
        <div className="w-12 h-12 rounded-[50%] text-white bg-[#D9D9D9] flex justify-center items-center">
          {" "}
          <span className="text-sm uppercase">
            {firstName[0] + lastName[0]}
          </span>
        </div>
      </div>
      <div className="col-span-6">
        <div className="justify-start items-start flex flex-col gap-1 min-w-full">
          <h4 className="text-gray-900 font-semibold text-sm capitalize w-full text-left">
            {firstName + " " + lastName}
          </h4>
          <span className="text-[10px] font-medium text-gray-700 truncate w-full text-left">
            {jobTitle + ", " + organization}
          </span>
          {currentCheckin && currentCheckin.checkin && (
            <div className="flex gap-1 text-[10px] text-[#717171]">
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
              <span>{day + "." + month + "." + year}</span>
            </div>
          )}
          <div className="flex gap-1.5 flex-wrap w-fit">
            {attendeeType
              .filter((type) => attendeeType.length > 1 && type !== "attendee")
              .map((type) => (
                <div
                  key={type}
                  className="py-0.5 w-[55px] px-1.5 rounded-sm bg-[#EEFAFF] text-[#2685CA] text-[10px] "
                >
                  {type}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center col-span-2">
<svg xmlns="http://www.w3.org/2000/svg" width={17} height={17} viewBox="0 0 17 17" fill="none">
  <g clipPath="url(#clip0_12415_20812)">
    <path d="M8.5001 14.9131C8.4019 14.9128 8.30657 14.88 8.22899 14.8198C5.75788 12.8998 4.05566 11.2464 2.86455 9.61532C1.34455 7.53087 0.997882 5.60643 1.83344 3.89532C2.42899 2.67309 4.1401 1.67309 6.1401 2.25532C7.09368 2.53076 7.92565 3.12144 8.5001 3.93087C9.07455 3.12144 9.90653 2.53076 10.8601 2.25532C12.8557 1.68198 14.5712 2.67309 15.1668 3.89532C16.0023 5.60643 15.6557 7.53087 14.1357 9.61532C12.9445 11.2464 11.2423 12.8998 8.77121 14.8198C8.69364 14.88 8.5983 14.9128 8.5001 14.9131ZM5.00233 2.97976C4.52644 2.96124 4.05449 3.07267 3.63715 3.30209C3.2198 3.53152 2.87282 3.87027 2.63344 4.28198C1.94455 5.69532 2.25566 7.26865 3.58455 9.08643C4.9968 10.908 6.65051 12.5288 8.5001 13.9042C10.3494 12.5302 12.0031 10.9109 13.4157 9.09087C14.749 7.26865 15.0557 5.69532 14.3668 4.28643C13.9223 3.39754 12.589 2.69087 11.1045 3.10865C10.6286 3.24932 10.1873 3.48808 9.80917 3.80957C9.43104 4.13106 9.1244 4.52816 8.90899 4.97532C8.87551 5.05683 8.81855 5.12655 8.74534 5.17562C8.67214 5.22469 8.58601 5.25089 8.49788 5.25089C8.40976 5.25089 8.32362 5.22469 8.25042 5.17562C8.17722 5.12655 8.12025 5.05683 8.08677 4.97532C7.87298 4.52704 7.56687 4.12902 7.1885 3.80732C6.81013 3.48563 6.36804 3.24754 5.89121 3.10865C5.60231 3.02474 5.30316 2.98136 5.00233 2.97976Z" fill="black" />
  </g>
  <defs>
    <clipPath id="clip0_12415_20812">
      <rect width={16} height={16} fill="white" transform="translate(0.5 0.5)" />
    </clipPath>
  </defs>
</svg>

        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <g clip-path="url(#clip0_11614_8940)">
            <path
              d="M15.1668 3.39532C14.5712 2.17309 12.8557 1.17309 10.8601 1.75532C9.90653 2.03076 9.07455 2.62144 8.5001 3.43087C7.92565 2.62144 7.09368 2.03076 6.1401 1.75532C4.1401 1.18198 2.42899 2.17309 1.83344 3.39532C0.997881 5.10643 1.34455 7.03087 2.86455 9.11532C4.05566 10.7464 5.75788 12.3998 8.22899 14.3198C8.30709 14.3807 8.40329 14.4137 8.50233 14.4137C8.60136 14.4137 8.69757 14.3807 8.77566 14.3198C11.2423 12.4042 12.949 10.7642 14.1401 9.11532C15.6557 7.03087 16.0023 5.10643 15.1668 3.39532Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_11614_8940">
              <rect
                width="16"
                height="16"
                fill="white"
                transform="translate(0.5)"
              />
            </clipPath>
          </defs>
        </svg> */}
        <button
          onClick={toggleCheckin}
          className={`text-[8px] flex items-center gap-0.5 ${
            currentCheckin && currentCheckin.checkin
              ? "text-basePrimary"
              : "text-gray-700"
          }`}
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
          <span>
            {currentCheckin && currentCheckin.checkin ? "undo" : "Check-in"}
          </span>
        </button>
      </div>
    </button>
  );
};

export default Attendee;
