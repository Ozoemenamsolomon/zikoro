import React, { Dispatch, SetStateAction, useRef } from "react";
import { THeaders } from "./";
// import { DialogClose } from "../../ui/dialog";
import { Button } from "@/components/ui/button";
import { TAttendee, TCompletedFields } from "@/types/attendee";
import { useUploadAttendees } from "@/hooks/services/attendee";
import { DialogClose } from "@/components/ui/dialog";
import { getCookie } from "@/hooks";
import { TUser } from "@/types";
import useEventStore from "@/store/globalEventStore";
import useUserStore from "@/store/globalUserStore";
import { EngagementsSettings } from "@/types/engagements";
import { useGetData } from "@/hooks/services/request";
import { generateAlias } from "@/utils";
import { generateAlphanumericHash } from "@/utils/helpers";

const Third = ({
  data,
  headers,
  getAttendees,
  excelHeaders,
  setStep,
}: {
  data: any[][];
  excelHeaders: any[];
  headers: Map<
    { label: string; value: keyof TAttendee; isRequired: boolean },
    any
  >;
  getAttendees: () => Promise<void>;
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  const event = useEventStore((state) => state.event);
  const {
    data: engagementsSettings,
    isLoading: engagementsSettingsIsLoading,
    getData: getEngagementsSettings,
  } = useGetData<EngagementsSettings>(
    `engagements/${event.eventAlias}/settings`
  );

  const headerMap = new Map(
    excelHeaders.map((header, index) => [header, index])
  );
  const { uploadAttendees } = useUploadAttendees();

  const { user, setUser } = useUserStore();

  const clsBtnRef = useRef<HTMLButtonElement>(null);

  const submitAttendees = async () => {
    const attendeeProfilePoints = parseInt(
      engagementsSettings
        ? engagementsSettings?.pointsAllocation["update profile"].points
        : 0
    );
    const payload: Partial<TAttendee>[] = data.map((row, index) => {
      const attendee: Partial<TAttendee> = {
        userEmail: user?.userEmail,
        eventId: String(event?.id),
        eventAlias: event?.eventAlias,
        registrationDate: new Date().toISOString(),
        attendeeType: ["attendee"],
        ticketType: "in-house",
        attendeeAlias: generateAlphanumericHash(7),
      };

      const completedFields: TCompletedFields = [];

      Array.from(headers).forEach(([key, value]) => {
        const rowValue = headerMap.get(value) ?? "";
        attendee[key.value] = row[rowValue];

        console.log(key.value, row[rowValue]);
        completedFields?.push(key.value);
      });

      attendee.attendeeProfilePoints =
        Object.keys(attendee).length * attendeeProfilePoints;

      console.log(
        attendee.attendeeProfilePoints,
        engagementsSettings?.pointsAllocation["update profile"],
        Object.keys(attendee).length
      );

      ("");
      return { ...attendee, completedFields };
    });

    await uploadAttendees({ payload });
    await getAttendees();
    clsBtnRef.current?.click();
  };

  const showRow = (value: any, row: any[]) => {
    if (!value) return;
    const rowValue = headerMap.get(value);

    return row[rowValue];
  };

  return (
    <>
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {Array.from(headers).map(([key, value]) => (
                <th
                  key={key.value}
                  className="py-2 px-4 border-b capitalize text-xs font-medium text-gray-600"
                >
                  {key.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr>
                {Array.from(headers).map(([key, value]) => (
                  <td className="py-2 px-4 border-b text-gray-500 text-tiny">
                    {showRow(value, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => setStep(1)} className="bg-basePrimary w-full">
          Back
        </Button>
        <Button
          className="bg-basePrimary w-full"
          onClick={submitAttendees}
          disabled={engagementsSettingsIsLoading}
        >
          Import Attendees
        </Button>
        <DialogClose asChild>
          <button ref={clsBtnRef} className="hidden">
            hidden
          </button>
        </DialogClose>
      </div>
    </>
  );
};

export default Third;
