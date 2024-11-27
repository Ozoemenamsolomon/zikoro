import { useGetAttendees } from "@/hooks/services/attendee";
import useOrganizationStore from "@/store/globalOrganizationStore";
import { useParams } from "next/navigation";
import React from "react";
import peopleCheck from "@/public/icons/people_check.svg";
import peopleCancel from "@/public/icons/people_cancel.svg";
import peopleCommunity from "@/public/icons/people_community.svg";
import speaker from "@/public/icons/speaker.svg";
import scheduleClock from "@/public/icons/schedule_clock.svg";
import schedules from "@/public/icons/schedules.svg";
import { useGetEventAgendas } from "@/hooks";
import {
  differenceInDays,
  eachDayOfInterval,
  format,
  isSameDay,
} from "date-fns";
import useEventStore from "@/store/globalEventStore";
import { LineChart } from "@mui/x-charts";
import { AnalyticsInfoCard } from "../AnalyticsPage";

const Attendance = () => {
  const { eventId } = useParams();
  const { event } = useEventStore();
  const { organization } = useOrganizationStore();

  const {
    attendees,
    isLoading: attendeesIsLoading,
    getAttendees,
  } = useGetAttendees({ eventId });

  const {
    eventAgendas,
    isLoading: eventAgendasIsLoading,
    getEventAgendas,
  } = useGetEventAgendas({
    eventId,
  });

  const attendeesWithAtLeastOneCheckIn = attendees.filter(
    ({ checkin }) => checkin && checkin.length > 0
  ).length;

  const attendeesNoShow = attendees.length - attendeesWithAtLeastOneCheckIn;

  const eventTeam = organization?.teamMembers.length;

  const sessions = eventAgendas?.length;

  const speakers = new Set(
    eventAgendas?.flatMap(({ sessionSpeakers }) =>
      sessionSpeakers.map(({ id }) => id)
    )
  ).size;

  const eventStartDateToNow = eachDayOfInterval({
    start: event?.startDateTime,
    end: new Date(),
  });

  console.log(eventStartDateToNow, event?.startDateTime);

  const checkedInOnDate = eventStartDateToNow.map(
    (currDate) =>
      attendees.filter(({ checkin }) =>
        checkin?.some(({ date }) => isSameDay(currDate, new Date(date)))
      ).length
  );

  console.log(checkedInOnDate);

  console.log(
    attendees.length,
    attendeesNoShow,
    attendeesWithAtLeastOneCheckIn
  );

  const calculateDifferenceInDays = (date: Date) =>
    differenceInDays(date, event?.startDateTime);

  return (
    <>
      <section className="grid md:grid-cols-3 gap-4">
        <AnalyticsInfoCard
          label={"Checked In"}
          description="attendees with at least one check in"
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
        <AnalyticsInfoCard
          label={"Event Team"}
          value={eventTeam}
          Icon={() => (
            <img
              className="h-10 w-10"
              src={peopleCommunity.src}
              alt={"event team"}
            />
          )}
        />
        <AnalyticsInfoCard
          label={"Tracks"}
          value={event?.sessionTrack.length}
          Icon={() => (
            <img className="h-10 w-10" src={schedules.src} alt={"track"} />
          )}
        />
        <AnalyticsInfoCard
          label={"Sessions"}
          value={sessions}
          Icon={() => (
            <img
              className="h-10 w-10"
              src={scheduleClock.src}
              alt={"sessions"}
            />
          )}
        />
        <AnalyticsInfoCard
          label={"Speakers"}
          value={speakers}
          Icon={() => (
            <img className="h-10 w-10" src={speaker.src} alt={"speaker"} />
          )}
        />
      </section>
      <section className="bg-white p-4 space-y-4 border rounded-md max-h-[300px] overflow-hidden">
        <h2 className="text-gray-600 font-medium text-sm">Sessions</h2>
        <div className="max-h-full overflow-auto no-scrollbar">
          <table className="border rounded-md w-full">
            <thead className="w-full">
              <tr className="flex bg-basePrimary/10 p-4 text-gray-600 font-medium">
                <td className="flex-[50%]">Date and Time</td>
                <td className="flex-[20%]">Session Name</td>
                <td className="flex-[10%]">Speakers</td>
                <td className="flex-[20%]">Average Rating </td>
              </tr>
            </thead>
            <tbody className="[&>*:not(:last-child)]:border-b w-full font-medium">
              {eventAgendas &&
                eventAgendas.map(
                  ({ startDateTime, sessionTitle, sessionSpeakers }) => (
                    <tr className="flex p-4 text-gray-800">
                      <td className="flex-[50%] flex items-center gap-4">
                        <div className="flex flex-col">
                          <span>{format(startDateTime, "EEEE, MMMM d")}</span>
                          <span>{format(startDateTime, "hh:mm a")}</span>
                        </div>
                      </td>
                      <td className="flex-[20%]">{sessionTitle}</td>
                      <td className="flex-[10%]">
                        <div className="flex flex-col">
                          {
                            sessionSpeakers?.map(({ firstName, lastName }) => (
                              <span>{firstName + " " + lastName}</span>
                            )).length
                          }
                        </div>
                      </td>
                      <td className="flex-[20%]">5.5</td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </section>
      <section className="bg-white p-4 space-y-4 border rounded-md max-h-[300px] overflow-hidden">
        <h2 className="text-gray-600 font-medium text-sm">
          Checked in Overview
        </h2>
        <div className="max-h-full overflow-auto no-scrollbar">
          <table className="border rounded-md w-full">
            <thead className="w-full">
              <tr className="flex bg-basePrimary/10 p-4 text-gray-600 font-medium">
                <td className="flex-[30%]">Event Days</td>
                <td className="flex-[50%]">Date and Time</td>
                <td className="flex-[20%]">Attendees Checked-in</td>
              </tr>
            </thead>
            <tbody className="[&>*:not(:last-child)]:border-b w-full font-medium">
              {eventStartDateToNow.map(
                (date, index) =>
                  checkedInOnDate[index] > 0 && (
                    <tr className="flex p-4 text-gray-800">
                      <td className="flex-[30%]">
                        <span>Day {calculateDifferenceInDays(date) + 1}</span>
                      </td>
                      <td className="flex-[50%] flex items-center gap-4">
                        <span>{format(date, "EEEE, MMMM d")}</span>
                      </td>
                      <td className="flex-[20%]">
                        <span>{checkedInOnDate[index]}</span>
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </section>
      <section className="bg-white p-4 space-y-4 border rounded-md">
        <h2 className="text-gray-600 font-medium text-sm">
          Checked in Overview
        </h2>
        <LineChart
          colors={["#001FCC"]}
          sx={{
            [`& .MuiChartsAxis-tickLabel`]: {
              fill: "#4b5563 !important",
              fontSize: "10px !important",
            },
            "& .MuiAreaElement-series-yaxis": {
              //   fill: "url('#lineGradient')",
              fill: "#001FCC10",
            },
            "& .MuiChartsAxis-line": {
              stroke: "#4b5563 !important",
            },
          }}
          xAxis={[
            {
              data: eventStartDateToNow,
              scaleType: "time",
              valueFormatter: (date) => format(date, "EEE, MMM d"),
              // tickMinStep:
              //   displayLineChart === "daily"
              //     ? differenceInMilliseconds(
              //         endOfDay(new Date()),
              //         startOfDay(new Date())
              //       )
              //     : displayLineChart === "weekly"
              //     ? differenceInMilliseconds(
              //         endOfWeek(new Date()),
              //         startOfWeek(new Date())
              //       )
              //     : displayLineChart === "monthly"
              //     ? differenceInMilliseconds(
              //         endOfMonth(new Date()),
              //         startOfMonth(new Date())
              //       )
              //     : 0,
            },
          ]}
          series={[
            {
              id: "yaxis",
              data: checkedInOnDate,
              showMark: false,
              area: true,
            },
          ]}
          height={300}
          margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
          //   grid={{ vertical: true, horizontal: true }}
        >
          <defs>
            <linearGradient
              id="lineGradient"
              // gradientTransform="rotate(90)"
              gradientUnits="userSpaceOnUse"
            >
              <stop
                // offset="5%"
                style={{ stopColor: "#001FCC80", stopOpacity: 1 }}
              >
                <stop
                  // offset="50%"
                  style={{ stopColor: "#ffffff", stopOpacity: 1 }}
                ></stop>
              </stop>
            </linearGradient>
          </defs>
        </LineChart>
      </section>
    </>
  );
};

export default Attendance;
