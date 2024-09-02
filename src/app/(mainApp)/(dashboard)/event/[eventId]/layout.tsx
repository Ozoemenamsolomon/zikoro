"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  useGetAttendeeWithEmail,
  useGetEvent,
  useUpdateAttendees,
} from "@/hooks";
import { useGetData } from "@/hooks/services/request";
import { cn } from "@/lib";
import useEventStore from "@/store/globalEventStore";
import useUserStore from "@/store/globalUserStore";
import { Event, TAttendee } from "@/types";
import { EngagementsSettings } from "@/types/engagements";
import { isBefore, isSameDay, isToday, isWithinInterval } from "date-fns";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { eventId }: { eventId: string } = useParams();
  const [isCheckedInToday, setCheckedIn] = useState<boolean>(false);
  // const currentEvent = useEventStore((state) => state.event);
  const setEvent = useEventStore((state) => state.setEvent);

  const { user } = useUserStore();

  const {
    attendee,
    isLoading: attendeeIsLoading,
    getAttendee,
  } = useGetAttendeeWithEmail({
    email: user?.userEmail,
    eventId,
  });

  const { event, getEvent, isLoading } = useGetEvent({
    eventId,
    isAlias: true,
  });

  console.log(event?.organization.teamMembers, user.userEmail);

  const {
    data: engagementsSettings,
    isLoading: engagementsSettingsIsLoading,
    getData: getEngagementsSettings,
  } = useGetData<EngagementsSettings>(`engagements/${eventId}/settings`);

  const { updateAttendees, isLoading: updatingAttendees } =
    useUpdateAttendees();

  const checkInForToday = async () => {
    if (
      !event ||
      !attendee ||
      !isWithinInterval(new Date(), {
        start: event.startDateTime,
        end: event.endDateTime,
      }) ||
      !event.selfCheckInAllowed
    )
      return;

    const allocatedcheckInPoints =
      engagementsSettings?.pointsAllocation["Checked in for an event"]
        ?.points ?? 0;
    const { checkin, checkInPoints } = attendee;
    const newDate = new Date();
    const updatedCheckin = checkin
      ? [
          ...checkin,
          {
            date: newDate,
            checkin: true,
          },
        ]
      : [
          {
            date: newDate,
            checkin: true,
          },
        ];

    const payload: TAttendee[] = [
      {
        ...attendee,
        checkin: updatedCheckin,
        checkInPoints: checkin
          ? checkInPoints + allocatedcheckInPoints
          : allocatedcheckInPoints,
      },
    ];

    await updateAttendees({
      payload,
      message: `Attendee check in successfully`,
    });

    await getAttendee();
  };

  useEffect(() => {
    if (attendeeIsLoading || !event) return;
    console.log(attendee?.eventId);
    console.log(
      !isWithinInterval(new Date(), {
        start: event.startDateTime,
        end: event.endDateTime,
      }),
      !!attendee?.checkin &&
        attendee?.checkin.some(({ date }) => isSameDay(new Date(), date)),
      event.startDateTime,
      event.endDateTime,
      new Date()
    );
    setCheckedIn(
      !isWithinInterval(new Date(), {
        start: event.startDateTime,
        end: event.endDateTime,
      }) ||
        (!!attendee?.checkin &&
          attendee?.checkin.some(({ date }) => isSameDay(new Date(), date)))
    );
  }, [attendeeIsLoading, isLoading, eventId]);

  useEffect(() => {
    if (isLoading || !event) return;
    setEvent(event);
  }, [isLoading, eventId]);

  return (
    <>
      {isLoading || attendeeIsLoading || engagementsSettingsIsLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {children}

          <Dialog
            open={
              !isCheckedInToday &&
              !!event &&
              !!event.selfCheckInAllowed &&
              !event.organization.teamMembers.some(
                ({ userEmail }) => userEmail === user.userEmail
              )
            }
          >
            <DialogContent>
              <DialogHeader>
                <span className="text-2xl font-bold">Check In Required</span>
              </DialogHeader>
              <p className="text-gray-700 font-medium">
                Please complete your check-in for today to continue using the
                app.
              </p>
              <DialogFooter>
                <Button
                  onClick={checkInForToday}
                  className={cn("bg-basePrimary text-white rounded-lg flex")}
                >
                  <p>Check In</p>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
