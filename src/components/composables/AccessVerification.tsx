"use client";

import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useCheckTeamMember, useFetchSingleEvent, useGetAllAttendees } from "@/hooks";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib";
import useUserStore from "@/store/globalUserStore";
import useAccessStore from "@/store/globalAcessStore";
import useOrganizationStore from "@/store/globalOrganizationStore";

export function AccessVerification({ id }: { id?: string | any }) {
  const pathname = usePathname();
  const { user } = useUserStore();
  const { organization } = useOrganizationStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [remainingTime, setRemainingTime] = useState(0);
  const { attendees, isLoading } = useGetAllAttendees(id);
  const [notRegistered] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
 const {isIdPresent} = useCheckTeamMember({eventId: id});
  const {
    data,
    loading: singleEventLoading,
    refetch,
  } = useFetchSingleEvent(id);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const { userAccess } = useAccessStore();

  useEffect(() => {
    if (data && !singleEventLoading) {
      let daysBeforeEventDateTime: Date | undefined;
      if (data?.eventAppAccess !== "now") {
        daysBeforeEventDateTime = new Date(data?.eventAppAccess);
        /**
         const timeDifference =
          eventDateTime.getTime() - daysBeforeEventDateTime.getTime();
      */
        setRemainingTime(daysBeforeEventDateTime.getTime());
      }
    }
  }, [data, singleEventLoading]);

  /**
   useEffect(() => {
    if (pathname) {
      refetch()
    }
  },[pathname])
 */

  console.log("single event loading", userAccess?.isTeamMember);

  useEffect(() => {
    if (!user) {
      window.open(`/live-events/${id}`, "_self");
      return;
    }
    if (
      !isLoading &&
      user !== null &&
      !singleEventLoading &&
      data !== null
    ) {
      console.log("I entered the hooks .....");
      const appAccess = data?.eventAppAccess;

      let remainder = remainingTime;

      let interval: NodeJS.Timeout | undefined;
      // Calculate the time difference between eventDate and daysBeforeEvent

      if (data?.eventAppAccess !== "now") {
        interval = setInterval(() => {
          remainder = remainder - new Date().getTime();

          if (remainder <= 0) {
            clearInterval(interval);

            setTimeRemaining(0);
          } else {
            // setRemainingTime(remainder);
            setTimeRemaining(remainder);
          }
        }, 1000);
      }
      const isTeamMember = organization?.teamMembers?.some(
        (v) => v?.userEmail === user?.userEmail
      ) || userAccess?.isTeamMember;
      // checked if the user is an attendee
      const isPresent = attendees?.some(({ email, eventAlias }) => {
        return eventAlias === id && email === user?.userEmail;
      });

      if (isTeamMember) {
        // user is a team member or an organizer
        setLoading(false);

        return () => clearInterval(interval);
      } else if (
        (appAccess === "now" && isPresent) ||
        (timeRemaining <= 0 && isPresent)
      ) {
        // user is an attendee
        if (pathname.includes("content")) {
          setNotAuthorized(true);
        } else {
          setLoading(false);
        }

        return () => clearInterval(interval);
      } else {
        if (!isPresent) {
          window.open(`/live-events/${id}`, "_self");
        }
        // router.push("/login");
        // pls remove after all the event have app access date on creation
        // if (isPresent) setLoading(false);

        return () => clearInterval(interval);
      }

      // return () => clearInterval(interval);
    }
  }, [user, isLoading, singleEventLoading, userAccess, pathname]);

  // const isLoadedAll = useMemo(() => {
  //   return (
  //     !isLoading &&
  //     user !== null &&
  //     !eventLoading &&
  //     !singleEventLoading &&
  //     data !== null
  //   );
  // }, [isLoading, user, eventLoading, singleEventLoading, data]);
  // console.log(
  //   "sdf==",
  //   userAccess?.isTeamMember,
  //   userAccess?.isOrganizer,
  //   loading
  // );
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  return (
    <div
      className={cn(
        "w-full h-full inset-0 backdrop-blur-2xl fixed z-[5000] hidden",
        loading && "block"
      )}
    >
      {timeRemaining > 0 ? (
        <div
          className={cn(
            " text-xs sm:text-sm items-center justify-center flex-col gap-y-3 m-auto absolute inset-0 h-fit w-fit flex"
          )}
        >
          <p className="text-sm sm:text-lg font-light tracking-[0.5em]">
            EVENT WILL BE ACCESSIBLE IN
          </p>
          <div className="flex items-center gap-x-3 sm:gap-x-4">
            <div className="flex flex-col items-center justify-center">
              <p className="font-semibold text-lg sm:text-3xl">{days}</p>
              <p>Days</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="font-semibold text-lg sm:text-3xl">{hours}</p>
              <p>Hours</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="font-semibold text-lg sm:text-3xl">{minutes}</p>
              <p>Minutes</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="font-semibold text-lg sm:text-3xl">{seconds}</p>
              <p>Seconds</p>
            </div>
          </div>
        </div>
      ) : notRegistered ? (
        <div className="flex items-center p-4 m-auto absolute inset-0 justify-center flex-col gap-y-1">
          <p>User is not a registered attendee for this event</p>
        </div>
      ) : notAuthorized ? (
        <div className="flex items-center p-4 m-auto absolute inset-0 justify-center flex-col gap-y-1">
          <p>You are not authorized to view this page</p>
        </div>
      ) : (
        <div className="flex items-center p-4 m-auto absolute inset-0 justify-center flex-col gap-y-1">
          <LoaderAlt size={30} className="animate-spin text-basePrimary" />
          <p className="text-[13px] sm:text-sm">Authenticating...</p>
        </div>
      )}
    </div>
  );
}
