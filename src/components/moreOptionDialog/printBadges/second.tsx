import { TAttendee } from "@/types/attendee";
import React, { useRef } from "react";
import { DialogClose } from "../../ui/dialog";
import { Button } from "@/components/ui/button";
import AttendeeBadge from "@/components/AttendeeBadge";
import { usePDF } from "react-to-pdf";

const Second = ({ selectedAttendees }: { selectedAttendees: TAttendee[] }) => {
  const parentRef = useRef();
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  const printBadges = () => {
    const parentElm = parentRef.current;

    // Remove the 'hidden' class
    parentElm.classList.remove("hidden");

    toPDF();

    parentElm.classList.add("hidden");
  };

  return (
    <>
      <div className="hidden" ref={parentRef}>
        <div className="grid grid-cols-3 gap-2 p-2 w-[1000px]" ref={targetRef}>
          {selectedAttendees.map((attendee) => (
            <div className="h-[450px]">
              <AttendeeBadge attendee={attendee} />
            </div>
          ))}
        </div>
      </div>
      <div className="pt-4 pb-12 w-full">
        <div className="relative flex h-[350px] w-full">
          <div className="absolute left-2 -z-10 w-[200px] h-full">
            <AttendeeBadge attendee={selectedAttendees[1]} />
          </div>
          <div className="w-[200px] absolute h-full left-1/2 -translate-x-1/2 top-10">
            <AttendeeBadge attendee={selectedAttendees[0]} />
          </div>
          <div className="absolute right-2 -z-10 w-[200px] h-full">
            <AttendeeBadge attendee={selectedAttendees[2]} />
          </div>
        </div>
      </div>
      <span className="text-gray-500 text-sm text-center">
        {selectedAttendees.length} Attendee Badges Selected
      </span>
      <DialogClose asChild>
        <Button
          disabled={selectedAttendees.length === 0}
          className="bg-basePrimary w-full"
          onClick={printBadges}
        >
          Download all badges as PDF
        </Button>
      </DialogClose>
    </>
  );
};

export default Second;
