// @ts-nocheck
"use client";
import useDisclose from "@/hooks/useDisclose";
import FirstSection from "./FirstSection";
import AddAttendeeForm from "@/components/AddAttendeeForm";
import SecondSection from "./SecondSection";
import { useState } from "react";
import { TAttendee } from "@/types/attendee";
import AddNotesForm from "@/components/AddNotesForm";
import AddTagForm from "@/components/AddTagForm";
import ThirdSection from "./ThirdSection";

const People = () => {
  const {
    isOpen: attendeeFormIsOpen,
    onOpen: onOpenAttendeeForm,
    onClose: onCloseAttendeeForm,
  } = useDisclose();
  const {
    isOpen: notesFormIsOpen,
    onOpen: onOpenNotesForm,
    onClose: onCloseNotesForm,
  } = useDisclose();
  const {
    isOpen: tagFormIsOpen,
    onOpen: onOpenTagForm,
    onClose: onCloseTagForm,
  } = useDisclose();
  const [selectedAttendee, setSelectedAttendee] = useState<TAttendee>(null);

  const selectAttendee = (attendee: TAttendee) => setSelectedAttendee(attendee);
  return (
    <section className="grid grid-cols-10 border-t-[1px] border-[#F3F3F3]">
      <FirstSection
        onOpen={onOpenAttendeeForm}
        onSelectAttendee={selectAttendee}
        selectedAttendee={selectedAttendee}
      />
      <section className="col-span-4 pt-4 space-y-4">
        {selectedAttendee ? (
          <SecondSection
            attendee={selectedAttendee}
            onOpenNotesForm={onOpenNotesForm}
            onOpenTagForm={onOpenTagForm}
          />
        ) : (
          <p className="px-2 text-lg font-medium text-gray-700">
            Select an attendee to view
          </p>
        )}
      </section>
      <ThirdSection />
      <AddAttendeeForm
        isOpen={attendeeFormIsOpen}
        onClose={onCloseAttendeeForm}
      />
      <AddNotesForm
        attendeeEmail={selectedAttendee?.email || ""}
        attendeeId={selectedAttendee?.id || ""}
        isOpen={notesFormIsOpen}
        onClose={onCloseNotesForm}
      />
      <AddTagForm
        attendeeEmail={selectedAttendee?.email || ""}
        attendeeId={selectedAttendee?.id || ""}
        isOpen={tagFormIsOpen}
        onClose={onCloseTagForm}
      />
    </section>
  );
};

export default People;
