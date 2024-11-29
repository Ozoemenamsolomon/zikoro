"use client";

import {
  useFetchSingleEvent,
  useGetEventAttendees,
  useRequestAccess,
} from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import Image from "next/image";
import { Input } from "../ui/input";
import { Button } from "./Button";
import { useState } from "react";
import { InlineIcon } from "@iconify/react";
export default function RequestAccess({ eventId }: { eventId: string }) {
  const { data, loading, refetch: refetchEvent } = useFetchSingleEvent(eventId);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { attendees: eventAttendees, isLoading: loadingAttendees } =
    useGetEventAttendees(eventId);
  const [isEmailNotPresent, setIsEmailNotPresent] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { requestEmail } = useRequestAccess();

  async function onSubmit(e: any) {
    e.preventDefault()
    if (loadingAttendees || eventAttendees?.length === 0) return;

    const isEmailPresent = eventAttendees?.find(
      (attendee) => attendee.userEmail === email
    );

    if (isEmailPresent) {
      setIsLoading(true);
      try {
        await requestEmail({
          email,
          paymentLink: isEmailPresent?.paymentLink!,
          eventTitle: data?.eventTitle!
        });
      } catch (error) {
      } finally {
        setIsEmailSent(true);
      }
    } else {
      setIsEmailNotPresent(true);
    }
    setIsLoading(false);
  }
  return (
    <div className="w-full h-full fixed inset-0 bg-[#F9FAFF]">
      {!loading && !data ? (
        <div className="absolute m-auto items-center justify-center flex inset-0">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      ) : (
        <div className="max-w-3xl w-full m-auto inset-0 absolute flex flex-col items-center justify-center gap-y-8 sm:gap-y-10">
          <div className="w-full flex  items-center gap-x-3">
            {data?.eventPoster ? (
              <Image
                src={data?.eventPoster}
                className="w-36 h-36 rounded-lg object-cover sm:w-64  sm:h-64"
                alt={data?.eventTitle}
                width={300}
                height={300}
              />
            ) : (
              <div className=" w-24 h-24 rounded-lg sm:w-80  sm:h-80  animate-pulse">
                <div className="w-full h-full bg-gray-200"></div>
              </div>
            )}
            <div className="flex flex-col gap-y-2 items-start justify-start">
              <div className="w-fit px-3 py-1 bg-gradient-to-tr border rounded-2xl border-[#001fcc] from-custom-bg-gradient-start to-custom-bg-gradient-end">
                <p className="gradient-text bg-basePrimary text-xs sm:text-sm">
                  {data?.locationType ?? ""}
                </p>
              </div>
              <h2 className="font-semibold text-lg sm:text-2xl">
                {data?.eventTitle ?? ""}
              </h2>
            </div>
          </div>

          {isEmailSent ? (
            <div className="w-full  flex flex-col items-center justify-center gap-4">
                <InlineIcon icon="lsicon:email-send-filled" fontSize={22}/>
              <h3 className="font-semibold text-sm sm:text-lg max-w-lg text-center">
                Access link has been sent to your email address (Please also
                check your spam). click on the link sent to get access to this
                event.
              </h3>
              <p className="text-gray-500 text-mobile sm:text-sm">
                Click on the link sent to get access to this event
              </p>
            </div>
          ) : (
            <>
              {isEmailNotPresent ? (
                <div className="w-full  flex flex-col items-center justify-center gap-4">
                  <h2 className="font-semibold text-base sm:text-xl">
                    We couldn’t identify you as a registered attendee for this
                    event.
                  </h2>
                  <div className="w-full h-12 rounded-md gap-3 border bg-white flex text-red-600 items-center px-4">
                    <InlineIcon
                      icon="line-md:alert-circle-twotone"
                      color="#dc2626"
                      fontSize={22}
                    />
                    <p>
                      Sorry you are not a registered attendee for this event
                    </p>
                  </div>
                  <Button
                    onClick={() => window.open(`/live-events/${eventId}`)}
                    className="w-fit h-12 bg-basePrimary text-white font-medium"
                  >
                    Register for this Event
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="w-full flex flex-col  items-center justify-center gap-4"
                >
                    <div className="w-full flex flex-col items-center justify-center gap-y-2">
                    <h2 className="font-semibold text-base sm:text-xl text-center">

We couldn’t identify you as a registered attendee for this event.

</h2>
<p className="text-center">  Please enter your email address below. If you’re registered, we’ll send you a link to join the event.</p>
                    </div>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 rounded-md border bg-transparent px-4"
                    placeholder="Enter Email Address"
                  />

                  <Button
                    disabled={isLoading || email === ""}
                    type="submit"
                    className="w-fit h-12 bg-basePrimary rounded-md text-white font-medium"
                  >
                    Get Access Link
                  </Button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
