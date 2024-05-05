import React, { useState, ChangeEvent } from "react";
import First from "./first";
import Second from "./second";
import Third from "./third";
import { TAttendee } from "@/types/attendee";
import { MoreOptionsProps } from "@/app/(mainApp)/(dashboard)/event/[eventId]/(home)/people/_reusable/FirstSection";

export type THeaders = {
  firstName: number | null;
  lastName: number | null;
  email: number | null;
  phoneNumber: number | null;
  whatsappNumber: number | null;
  attendeeType: string[];
};

const ImportAttendees: React.FC<MoreOptionsProps> = ({
  attendees,
  getAttendees,
}) => {
  const [step, setStep] = useState<number>(0);
  const [excelResult, setExcelResult] = useState<any[][]>([]);
  const [headers, setHeaders] = useState<
    Map<{ label: string; value: keyof TAttendee; isRequired: boolean }, any>
  >(
    new Map([
      [{ label: "First name", value: "firstName", isRequired: true }, null],
      [{ label: "Last name", value: "lastName", isRequired: true }, null],
      [{ label: "Email", value: "email", isRequired: true }, null],
      [{ label: "Phone number", value: "phoneNumber", isRequired: true }, null],
      [{ label: "WhatsApp", value: "whatsappNumber", isRequired: false }, null],
      [{ label: "jobTitle", value: "jobTitle", isRequired: false }, null],
      [
        { label: "organization", value: "organization", isRequired: false },
        null,
      ],
      [{ label: "city", value: "city", isRequired: false }, null],
      [{ label: "country", value: "country", isRequired: false }, null],
      [{ label: "bio", value: "bio", isRequired: false }, null],
      [{ label: "x", value: "x", isRequired: false }, null],
      [{ label: "LinkedIn", value: "linkedin", isRequired: false }, null],
      [{ label: "instagram", value: "instagram", isRequired: false }, null],
      [{ label: "facebook", value: "facebook", isRequired: false }, null],
    ])
  );

  const updateHeader = (
    key: { label: string; value: keyof TAttendee; isRequired: boolean },
    value: string
  ) => {
    console.log(value);
    setHeaders((prevHeaders) => {
      prevHeaders.set(key, value);
      return prevHeaders;
    });
  };

  const deleteHeader = (key: {
    label: string;
    value: keyof TAttendee;
    isRequired: boolean;
  }) => {
    setHeaders((prevHeaders) => {
      prevHeaders.delete(key);
      return prevHeaders;
    });
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-auto hide-scrollbar py-4 px-4">
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

          <span className="text-xs font-medium text-gray-500">Upload</span>
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
            map Attendees
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
        <First setExcelResult={setExcelResult} step={step} setStep={setStep} />
      ) : step === 1 ? (
        <Second
          headers={headers}
          updateHeader={updateHeader}
          deleteHeader={deleteHeader}
          excelHeaders={excelResult[0]}
          step={step}
          setStep={setStep}
        />
      ) : (
        <Third
          excelHeaders={excelResult[0]}
          data={excelResult.filter((row, index) => index > 0)}
          headers={headers}
          getAttendees={getAttendees}
          setStep={setStep}
          getAttendees={getAttendees}
        />
      )}
    </div>
  );
};

export default ImportAttendees;
