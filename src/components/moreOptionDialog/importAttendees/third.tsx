import React from "react";
import { THeaders } from "./";
import { DialogClose } from "../../ui/dialog";
import { Button } from "@/components/ui/button";
import { TAttendee } from "@/types/attendee";
import { useUpdateAttendees } from "@/services/attendee";

const Third = ({
  data,
  headers,
  getAttendees,
}: {
  data: any[][];
  headers: THeaders;
  getAttendees: () => Promise<void>;
}) => {
  const { updateAttendees } = useUpdateAttendees();

  const submitAttendees = async () => {
    const payload: TAttendee[] = data.map((row, index) => {
      const attendee: Partial<TAttendee> = {
        userEmail: "ubahyusuf484@gmail.com",
        eventId: "1234567890",
        registrationDate: new Date().toISOString(),
        attendeeType: ["attendee"],
      };

      Object.entries(headers).forEach(([key, headerValue]) => {
        attendee[key] = row[headerValue];
      });

      return attendee;
    });

    console.log(payload);
    await updateAttendees({ payload });
    await getAttendees();
  };

  return (
    <>
      <div className="overflow-x-auto max-w-full">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {Object.keys(headers).map((header) => (
                <th
                  key={header}
                  className="py-2 px-4 border-b capitalize text-xs font-medium text-gray-600"
                >
                  {header.replace(/([a-z])([A-Z])/g, `$1 $2`).toLowerCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr>
                <td className="py-2 px-4 border-b text-gray-500 text-[10px]">
                  {row[headers.firstName]}
                </td>
                <td className="py-2 px-4 border-b text-gray-500 text-[10px]">
                  {row[headers.lastName]}
                </td>
                <td className="py-2 px-4 border-b text-gray-500 text-[10px]">
                  {row[headers.email]}
                </td>
                <td className="py-2 px-4 border-b text-gray-500 text-[10px]">
                  {row[headers.phoneNumber]}
                </td>
                <td className="py-2 px-4 border-b text-gray-500 text-[10px]">
                  {row[headers.whatsappNumber]}
                </td>
                <td className="py-2 px-4 border-b text-gray-500 text-[10px]">
                  Attendee
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <DialogClose asChild>
        <Button className="bg-basePrimary w-full" onClick={submitAttendees}>
          Import Attendees
        </Button>
      </DialogClose>
    </>
  );
};

export default Third;
