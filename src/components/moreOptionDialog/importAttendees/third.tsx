import React from "react";
import { THeaders } from "./";
// import { DialogClose } from "../../ui/dialog";
import { Button } from "@/components/ui/button";
import { TAttendee } from "@/types/attendee";
import { useUpdateAttendees } from "@/hooks/services/attendee";

const Third = ({
  data,
  headers,
  getAttendees,
  excelHeaders,
}: {
  data: any[][];
  excelHeaders: any[];
  headers: Map<
    { label: string; value: keyof TAttendee; isRequired: boolean },
    any
  >;
  getAttendees: () => Promise<void>;
}) => {
  const headerMap = new Map(
    excelHeaders.map((header, index) => [header, index])
  );
  const { updateAttendees } = useUpdateAttendees();

  const submitAttendees = async () => {
    const payload: Partial<TAttendee>[] = data.map((row, index) => {
      const attendee: Partial<TAttendee> = {
        userEmail: "ubahyusuf484@gmail.com",
        eventId: "1234567890",
        registrationDate: new Date().toISOString(),
        attendeeType: ["attendee"],
      };

      Array.from(headers).forEach(([key, value]) => {
        const rowValue = headerMap.get(value);
        if (!rowValue) return;
        attendee[key.value] = row[rowValue];
      });

      return attendee;
    });

    console.log(payload);
    await updateAttendees({ payload });
    await getAttendees();
  };

  const showRow = (value: any, row: any[]) => {
    const rowValue = headerMap.get(value);
    return rowValue && row[rowValue];
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
      {/* <DialogClose asChild>
        <Button className="bg-basePrimary w-full" onClick={submitAttendees}>
          Import Attendees
        </Button>
      </DialogClose> */}
    </>
  );
};

export default Third;
