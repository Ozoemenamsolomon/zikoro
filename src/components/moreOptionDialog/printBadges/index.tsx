import React, { useState } from "react";
import First from "./first";
import Preview from "./preview";
import { MoreOptionsProps } from "@/app/people/_reusable/FirstSection";
import { TAttendee } from "@/types/attendee";
import Dimensions from "./dimensions";

const PrintBadges: React.FC<MoreOptionsProps> = ({
  attendees,
  getAttendees,
  favourites,
  attendeesTags,
}) => {
  const [step, setStep] = useState<number>(0);
  const [mappedAttendees, setMappedAttendees] =
    useState<TAttendee[]>(attendees);
  const [selectedAttendees, setSelectedAttendees] = useState<TAttendee[]>([]);

  return (
    <div className="space-y-6 max-h-[80vh] overflow-auto hide-scrollbar py-4 pl-4 pr-1">
      <div className="flex gap-2 items-center pr-2">
        <div className="flex gap-1 items-center">
          <svg
            width={16}
            height={17}
            viewBox="0 0 16 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx={8}
              cy="8.5"
              r={7}
              fill="#001FCC"
              stroke="#001FCC"
              strokeWidth={2}
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.8334 5.81037C11.9405 5.91753 12.0007 6.06285 12.0007 6.21437C12.0007 6.3659 11.9405 6.51121 11.8334 6.61837L7.26193 11.1898C7.15477 11.2969 7.00946 11.3571 6.85793 11.3571C6.70641 11.3571 6.56109 11.2969 6.45393 11.1898L4.16822 8.90409C4.06413 8.79631 4.00653 8.65197 4.00783 8.50214C4.00914 8.35232 4.06923 8.209 4.17518 8.10305C4.28113 7.9971 4.42445 7.937 4.57428 7.9357C4.7241 7.9344 4.86845 7.992 4.97622 8.09609L6.85793 9.9778L11.0254 5.81037C11.1325 5.70325 11.2778 5.64307 11.4294 5.64307C11.5809 5.64307 11.7262 5.70325 11.8334 5.81037Z"
              fill="white"
            />
          </svg>

          <span className="text-xs font-medium text-gray-500">
            Select Attendee
          </span>
        </div>

        <div
          className={`${
            step > 0 ? "bg-basePrimary" : "bg-gray-200"
          } h-[1px] flex-1`}
        />

        <div className="flex gap-1 items-center">
          {step > 0 ? (
            <svg
              width={16}
              height={17}
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx={8}
                cy="8.5"
                r={7}
                fill="#001FCC"
                stroke="#001FCC"
                strokeWidth={2}
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.8334 5.81037C11.9405 5.91753 12.0007 6.06285 12.0007 6.21437C12.0007 6.3659 11.9405 6.51121 11.8334 6.61837L7.26193 11.1898C7.15477 11.2969 7.00946 11.3571 6.85793 11.3571C6.70641 11.3571 6.56109 11.2969 6.45393 11.1898L4.16822 8.90409C4.06413 8.79631 4.00653 8.65197 4.00783 8.50214C4.00914 8.35232 4.06923 8.209 4.17518 8.10305C4.28113 7.9971 4.42445 7.937 4.57428 7.9357C4.7241 7.9344 4.86845 7.992 4.97622 8.09609L6.85793 9.9778L11.0254 5.81037C11.1325 5.70325 11.2778 5.64307 11.4294 5.64307C11.5809 5.64307 11.7262 5.70325 11.8334 5.81037Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              width={16}
              height={17}
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx={8}
                cy="8.5"
                r={7}
                fill="#CFCFCF"
                stroke="#CFCFCF"
                strokeWidth={2}
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.8334 5.81037C11.9405 5.91753 12.0007 6.06285 12.0007 6.21437C12.0007 6.3659 11.9405 6.51121 11.8334 6.61837L7.26193 11.1898C7.15477 11.2969 7.00946 11.3571 6.85793 11.3571C6.70641 11.3571 6.56109 11.2969 6.45393 11.1898L4.16822 8.90409C4.06413 8.79631 4.00653 8.65197 4.00783 8.50214C4.00914 8.35232 4.06923 8.209 4.17518 8.10305C4.28113 7.9971 4.42445 7.937 4.57428 7.9357C4.7241 7.9344 4.86845 7.992 4.97622 8.09609L6.85793 9.9778L11.0254 5.81037C11.1325 5.70325 11.2778 5.64307 11.4294 5.64307C11.5809 5.64307 11.7262 5.70325 11.8334 5.81037Z"
                fill="white"
              />
            </svg>
          )}

          <span
            className={`text-xs font-medium ${
              step > 0 ? "text-gray-500" : "text-gray-200"
            }`}
          >
            Badge Size
          </span>
        </div>
        <div
          className={`${
            step > 1 ? "bg-basePrimary" : "bg-gray-200"
          } h-[1px] flex-1`}
        />

        <div className="flex gap-1 items-center">
          {step > 1 ? (
            <svg
              width={16}
              height={17}
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx={8}
                cy="8.5"
                r={7}
                fill="#001FCC"
                stroke="#001FCC"
                strokeWidth={2}
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.8334 5.81037C11.9405 5.91753 12.0007 6.06285 12.0007 6.21437C12.0007 6.3659 11.9405 6.51121 11.8334 6.61837L7.26193 11.1898C7.15477 11.2969 7.00946 11.3571 6.85793 11.3571C6.70641 11.3571 6.56109 11.2969 6.45393 11.1898L4.16822 8.90409C4.06413 8.79631 4.00653 8.65197 4.00783 8.50214C4.00914 8.35232 4.06923 8.209 4.17518 8.10305C4.28113 7.9971 4.42445 7.937 4.57428 7.9357C4.7241 7.9344 4.86845 7.992 4.97622 8.09609L6.85793 9.9778L11.0254 5.81037C11.1325 5.70325 11.2778 5.64307 11.4294 5.64307C11.5809 5.64307 11.7262 5.70325 11.8334 5.81037Z"
                fill="white"
              />
            </svg>
          ) : (
            <svg
              width={16}
              height={17}
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx={8}
                cy="8.5"
                r={7}
                fill="#CFCFCF"
                stroke="#CFCFCF"
                strokeWidth={2}
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.8334 5.81037C11.9405 5.91753 12.0007 6.06285 12.0007 6.21437C12.0007 6.3659 11.9405 6.51121 11.8334 6.61837L7.26193 11.1898C7.15477 11.2969 7.00946 11.3571 6.85793 11.3571C6.70641 11.3571 6.56109 11.2969 6.45393 11.1898L4.16822 8.90409C4.06413 8.79631 4.00653 8.65197 4.00783 8.50214C4.00914 8.35232 4.06923 8.209 4.17518 8.10305C4.28113 7.9971 4.42445 7.937 4.57428 7.9357C4.7241 7.9344 4.86845 7.992 4.97622 8.09609L6.85793 9.9778L11.0254 5.81037C11.1325 5.70325 11.2778 5.64307 11.4294 5.64307C11.5809 5.64307 11.7262 5.70325 11.8334 5.81037Z"
                fill="white"
              />
            </svg>
          )}

          <span
            className={`text-xs font-medium ${
              step > 1 ? "text-gray-500" : "text-gray-200"
            }`}
          >
            Preview
          </span>
        </div>
      </div>
      {step === 0 ? (
        <First
          mappedAttendees={mappedAttendees}
          setMappedAttendees={setMappedAttendees}
          selectedAttendees={selectedAttendees}
          setSelectedAttendees={setSelectedAttendees}
          step={step}
          setStep={setStep}
          favourites={favourites}
          attendeesTags={attendeesTags}
        />
      ) : step === 1 ? (
        <Dimensions />
      ) : (
        <Preview selectedAttendees={selectedAttendees} />
      )}
    </div>
  );
};

export default PrintBadges;
