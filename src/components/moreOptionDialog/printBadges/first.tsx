import { Button } from "@/components/ui/button";
import { TAttendee } from "@/types/attendee";
import { Dispatch, SetStateAction } from "react";
import ViewAttendeesSection from "../viewAttendeesSection";

const First = ({
  mappedAttendees,
  setMappedAttendees,
  selectedAttendees,
  setSelectedAttendees,
  step,
  setStep,
}: {
  mappedAttendees: TAttendee[];
  setMappedAttendees: Dispatch<SetStateAction<TAttendee[]>>;
  selectedAttendees: TAttendee[];
  setSelectedAttendees: Dispatch<SetStateAction<TAttendee[]>>;
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
}) => {
  // useEffect(() => {
  //   setMappedAttendees(
  //     attendees.filter(({ checkin }) =>
  //       action === "checkin"
  //         ? !checkin ||
  //           !checkin.some((entry) => entry.date === eventDate && entry.checkin)
  //         : checkin?.some(
  //             (entry) => entry.date === eventDate && entry.checkin
  //           ) || false
  //     )
  //   );
  // }, [attendees, eventDate, action]);

  type ValueType = TAttendee | TAttendee[];

  const toggleValue = (value: ValueType) => {
    const updatedValue = Array.isArray(value)
      ? value
      : value && selectedAttendees.includes(value)
      ? selectedAttendees.filter((item) => item !== value)
      : [...selectedAttendees, value];

    setSelectedAttendees(updatedValue);
  };

  const onSubmit = async () => {
    setStep(1);
  };

  return (
    <>
      <ViewAttendeesSection
        attendees={mappedAttendees}
        selectedAttendees={selectedAttendees}
        toggleValue={toggleValue}
      />
      <Button
        disabled={selectedAttendees.length === 0}
        className="bg-basePrimary w-full"
        onClick={onSubmit}
      >
        Continue
      </Button>
    </>
  );
};

export default First;
