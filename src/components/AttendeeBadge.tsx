import { TAttendee } from "@/types/attendee";
import React from "react";
import QRCode from "react-qr-code";

const AttendeeBadge = ({ attendee }: { attendee: TAttendee }) => {
  const { id, firstName, lastName, organization, jobTitle, attendeeType } =
    attendee;
  const oneAttendeeType = () => {
    const hierarchyOrder = [
      "sponsor",
      "exhibitor",
      "speaker",
      "organizer",
      "moderator",
    ];

    if (!attendeeType) {
      return "attendee";
    }

    for (const type of hierarchyOrder) {
      const pickedType = attendeeType.find((currType) => currType === type);
      if (pickedType) {
        return pickedType;
      }
    }
  };

  return (
    <div className="w-full h-full rounded-md relative border-[1px] capitalize">
      <div className="bg-green-800 h-1/3 rounded-t-md" />
      <div className="bg-white h-2/3 relative pt-[50px] pb-2 rounded-b-md">
        <div className="rounded-full bg-gray-300 h-[100px] w-[100px] absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 border-2 border-green-700" />
        <div className="flex flex-col justify-center items-center gap-2 p-2">
          <span className="text-gray-800 uppercase font-medium">
            {firstName + " " + lastName}
          </span>
          <span className="text-sm text-gray-600">{jobTitle}</span>
          <span className="text-sm text-gray-600">{organization}</span>
          {/* <svg
            width={79}
            height={80}
            viewBox="0 0 79 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <rect width="78.894" height={80} fill="url(#pattern0)" />
            <defs>
              <pattern
                id="pattern0"
                patternContentUnits="objectBoundingBox"
                width={1}
                height={1}
              >
                <use
                  xlinkHref="#image0_11611_4581"
                  transform="matrix(0.00482866 0 0 0.0047619 -0.00700937 0)"
                />
              </pattern>
              <image
                id="image0_11611_4581"
                width={210}
                height={210}
                xlinkHref="data:image/jpeg;base64,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"
              />
            </defs>
          </svg> */}
          <div
            style={{
              height: "auto",
              margin: "0 auto",
              maxWidth: 64,
              width: "100%",
            }}
          >
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={id}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>
      </div>
      <div className="bg-green-800 w-full h-6 absolute bottom-0 flex justify-center items-center rounded-b">
        <span className="text-white text-tiny font-medium text-center uppercase tracking-[0.3em]">
          {oneAttendeeType()}
        </span>
      </div>
      <div className="bg-green-800 w-6 h-12 absolute bottom-0 rounded-r-lg rounded-bl left-0" />
      <div className="bg-green-800 w-6 h-12 absolute bottom-0 rounded-l-lg rounded-br right-0" />
    </div>
  );
};

export default AttendeeBadge;
