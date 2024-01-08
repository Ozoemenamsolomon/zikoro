import { TAttendee } from "@/types/attendee";
import React from "react";
import { DialogClose } from "../../ui/dialog";
import { Button } from "@/components/ui/button";

const Second = ({ selectedAttendees }: { selectedAttendees: TAttendee[] }) => {
  return (
    <>
      <span className="text-gray-500 text-sm">
        {selectedAttendees.length} Attendee Badges Selected
      </span>
      <DialogClose asChild>
        <Button
          //   disabled={selectedAttendees.length === 0 || !eventDate}
          className="bg-basePrimary w-full"
          //   onClick={onSubmit}
        >
          Download all badges as PDF
        </Button>
      </DialogClose>
    </>
  );
};

export default Second;
