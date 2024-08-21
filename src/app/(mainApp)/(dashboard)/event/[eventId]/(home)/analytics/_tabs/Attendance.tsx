import { useGetAttendees } from "@/hooks/services/attendee";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { useParams } from "next/navigation";
import React from "react";
import { AnalyticsInfoCard } from "../page";
import peopleCheck from "@/public/icons/people_check.svg";
import peopleCancel from "@/public/icons/people_cancel.svg";

const Attendance = () => {
  const { eventId } = useParams();
  const { organization } = useOrganizationStore();

  const {
    attendees,
    isLoading: attendeesIsLoading,
    getAttendees,
  } = useGetAttendees({ eventId });

  const attendeesWithAtLeastOneCheckIn =
    attendees.filter(({ checkin }) => checkin && checkin.length > 0).length;

  const attendeesNoShow =
    attendees.length - attendeesWithAtLeastOneCheckIn;

  console.log(
    attendees.length,
    attendeesNoShow,
    attendeesWithAtLeastOneCheckIn
  );

  return (
    <>
      <section className="grid md:grid-cols-3 gap-4">
        <AnalyticsInfoCard
          label={"Checked In"}
          value={attendeesWithAtLeastOneCheckIn}
          Icon={() => (
            <img
              className="h-10 w-10"
              src={peopleCheck.src}
              alt={"checked in"}
            />
          )}
        />
        <AnalyticsInfoCard
          label={"No Show"}
          value={attendeesNoShow}
          Icon={() => (
            <img className="h-10 w-10" src={peopleCancel.src} alt={"no show"} />
          )}
        />
      </section>
    </>
  );
};

export default Attendance;
