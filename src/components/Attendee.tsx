import { TAttendee } from "@/types/attendee";
import { formatDateToHumanReadable, getTimeFromDate } from "@/utils/date";

type AttendeeProps = {
  attendee: TAttendee;
  isSelected: boolean;
  selectAttendee: (attendee: TAttendee) => void;
};

const Attendee: React.FC<AttendeeProps> = ({
  attendee,
  isSelected,
  selectAttendee,
}) => {
  const {
    id,
    firstName,
    lastName,
    jobTitle,
    organization,
    registrationDate,
    attendeeType,
  } = attendee;

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
          {/* <div className=" flex space-x-1 text-[10px] text-[#717171]">
          <span className="">{getTimeFromDate(registrationDate)}</span>
          <span className="">
            {formatDateToHumanReadable(registrationDate)}
          </span>
        </div> */}
          <div className="flex gap-1.5 flex-wrap w-fit">
            {attendeeType.map((type) => {
              if (type === "attendee" && attendeeType.length > 1) return;
              return (
                <div
                  key={type}
                  className="py-0.5 w-[55px] px-1.5 rounded-sm bg-[#EEFAFF] text-[#2685CA] text-[10px] "
                >
                  {type}
                </div>
              );
            })}
            {/* <div
            className={`py-0.5 w-[55px] px-1.5 rounded-sm ${
              role2 ? "bg-[#EEFAFF]" : ""
            }  text-[#2685CA] text-[10px] `}
          >
            {role2}
          </div> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 items-center col-span-2">
        <svg
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
        </svg>
        <div className="text-[8px] flex items-center gap-0.5">
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
                stroke="#3E404B"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <span className="text-gray-700 ">Check-in</span>
        </div>
      </div>
    </button>
  );
};

export default Attendee;
