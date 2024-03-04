"use client";

import { TimeFive } from "@styled-icons/boxicons-solid/TimeFive";
import { LocationDot } from "@styled-icons/fa-solid/LocationDot";
import { CalendarDateFill } from "@styled-icons/bootstrap/CalendarDateFill";
import { Telephone } from "styled-icons/bootstrap";
import { Whatsapp } from "styled-icons/remix-fill";
import { EmailOutline } from "styled-icons/evaicons-outline";
import Image from "next/image";
import { Button } from "@/components";
import { Share } from "@styled-icons/bootstrap/Share";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "next-share";
import { EventLocationType, AboutWidget } from "@/components/composables";
import Link from "next/link";
import { cn } from "@/lib";
import { Users } from "@styled-icons/fa-solid/Users";
import {
  formatDate,
  formatTime,
  dateFormatting,
  calculateTimeDifference,
  hasTimeElapsed,
  COUNTRIES_CURRENCY,
} from "@/utils";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/constants";
import { useState, useMemo } from "react";
import { BookEvent } from "..";
import { useRouter } from "next/navigation";
import { Event, OrganizerContact } from "@/types";

export function SingleEvent({
  className,
  isDetail,
  event,
  useDiv = false,
  organization,
  eventId,
  imageClassName,
}: {
  isDetail?: boolean;
  className?: string;
  event?: Event;
  organization?: string | null;
  eventId?: number;
  useDiv?: boolean;
  imageClassName?: string;
}) {
  const Comp = useDiv ? "div" : "button";
  const [isOpen, setOpen] = useState(false);

  const [isShareDropDown, showShareDropDown] = useState(false);

  const router = useRouter();

  function onClose() {
    // if (isDetail) return;
    setOpen((prev) => !prev);
  }

  const startDate = useMemo(
    () => formatDate(event?.startDateTime ?? "0"),
    [event?.startDateTime ?? "0"]
  );
  const endDate = useMemo(
    () => formatDate(event?.endDateTime ?? "0"),
    [event?.endDateTime ?? "0"]
  );

  const startTime = useMemo(
    () => formatTime(event?.startDateTime ?? "0"),
    [event?.startDateTime ?? "0"]
  );
  const endTime = useMemo(
    () => formatTime(event?.endDateTime ?? "0"),
    [event?.endDateTime ?? "0"]
  );

  const createdAt = useMemo(
    () => dateFormatting(event?.createdAt ?? "0"),
    [event?.createdAt ?? "0"]
  );

  const timeDifference = useMemo(
    () => calculateTimeDifference(event?.startDateTime, event?.endDateTime),
    [event?.startDateTime ?? "0", event?.endDateTime ?? "0"]
  );

  const isExpired = useMemo(
    () => hasTimeElapsed(event?.endDateTime),
    [event?.endDateTime ?? "0"]
  );

  // call phone
  function phoneCall() {
    window.open(`tel:${event?.phoneNumber}`, "_blank");
  }
  // chat on whatsapp
  function whatsapp() {
    window.open(`https://wa.me/${event?.whatsappNumber}`, "_blank");
  }

  // send mail
  function sendMail() {
    window.open(`mailto:${event?.email}`, "_blank");
  }

  function toggleShareDropDown() {
    showShareDropDown((prev) => !prev);
  }


  // conditonally adding comma to separate city and location
  const removeComma = useMemo(() => {
    return event?.eventCity === null || event?.eventCountry === null;
  }, [event?.eventCity, event?.eventCountry]);

  const isAllContactUnavailable = useMemo(() => {
    return (
      event?.phoneNumber === null ||
      event?.whatsappNumber === null ||
      event?.email === null
    );
  }, [event?.phoneNumber, event?.whatsappNumber, event?.email]);

  const isAllSocialUnavailable = useMemo(() => {
    return (
      event?.x === null &&
      event?.instagram === null &&
      event?.linkedin === null &&
      event?.facebook === null
    );
  }, [event?.x, event?.instagram, event?.linkedin, event?.facebook]);

  // determingn the currerncy symbol
  const currency = useMemo(() => {
    if (event?.pricingCurrency) {
      const symbol =
        COUNTRIES_CURRENCY.find(
          (v) => String(v.code) === String(event?.pricingCurrency)
        )?.symbol ?? "₦";
      return symbol;
    }
  }, [event?.pricingCurrency]);

  // calculating the difference between the expected participants and  registered participants
  const availableSlot = useMemo(() => {
    return Number(event?.expectedParticipants) - Number(event?.registered);
  }, [event?.expectedParticipants, event?.registered]);

  const organizerContact: OrganizerContact = {
    whatsappNumber: event?.whatsappNumber,
    phoneNumber: event?.phoneNumber,
    email: event?.email,
  };

  const price = useMemo(() => {
    if (Array.isArray(event?.pricing)) {
      const prices = event?.pricing?.map(({ price }) => Number(price));
      const standardPrice = prices.reduce((lowestPrice, currentPrice) => {
        return currentPrice < lowestPrice ? currentPrice : lowestPrice;
      }, prices[0]);

      return Number(standardPrice)?.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      });
    } else {
      return "";
    }
  }, [event?.pricing]);

  return (
    <>
      <Comp
        disabled={isExpired}
        onClick={() => router.push(`/live-events/${event?.id}`)}
        className={cn("w-full h-fit")}
      >
        <div
          className={cn(
            "w-full flex flex-col justify-start items-start gap-y-4 bg-white rounded-2xl  shadow h-fit ",
            isExpired && "relative",
            className
          )}
        >
          {isExpired && (
            <div className="w-full h-full inset-0 absolute z-10 bg-white/50"></div>
          )}
          <div className="w-full grid grid-cols-1 h-full gap-4 lg:grid-cols-8 items-start">
            <div className="w-full h-full flex lg:col-span-4 flex-col items-start justify-start gap-y-4">
              {Array.isArray(event?.eventPoster) &&
              event?.eventPoster?.length > 0 ? (
                <Image
                  src={event?.eventPoster[0]}
                  alt="event-image"
                  width={600}
                  height={600}
                  className={cn(
                    "w-full h-full rounded-t-2xl sm:rounded-tr-none sm:rounded-l-2xl object-cover"
                  )}
                />
              ) : (
                <div className="w-full h-full rounded-t-2xl sm:rounded-tr-none sm:rounded-l-2xl  animate-pulse">
                  <div className="w-full h-full bg-gray-200"></div>
                </div>
              )}
            </div>
            {/** */}
            <div className="w-full lg:col-span-4 flex flex-col gap-y-3 py-4 px-4 sm:px-10 sm:py-6 items-start justify-start">
              <p className="text-base text-start w-full  sm:text-2xl font-medium  ">
                {event?.eventTitle}
              </p>
              <div className="flex items-center justify-between w-full">
                <AboutWidget
                  Icon={CalendarDateFill}
                  text={
                    <div className="flex items-center gap-x-2">
                      <p>{`${startDate} – ${endDate}`}</p>
                      {timeDifference && (
                        <p className="text-xs bg-gray-100 rounded-md p-2 ">
                          {timeDifference}
                        </p>
                      )}
                    </div>
                  }
                />
                <EventLocationType
                  locationType={event?.locationType}
                  className="w-fit px-4 h-10 text-xs"
                />
              </div>
              <AboutWidget Icon={TimeFive} text={`${startTime} - ${endTime}`} />
              <AboutWidget
                Icon={LocationDot}
                text={
                  <p>
                    {`${event?.eventCity ?? ""}`}
                    {!removeComma && <span>,</span>}
                    {`${event?.eventCountry ?? ""}`}
                  </p>
                }
              />

              <div className="w-full flex items-center gap-x-6 justify-start">
                {(event?.phoneNumber !== null ||
                  event?.whatsappNumber !== null ||
                  event?.email !== null) && <h3>Speak with the Event Team</h3>}

                <div className="flex items-center gap-x-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      phoneCall();
                    }}
                    disabled={event?.phoneNumber === null}
                    className={cn(
                      "text-black h-fit w-fit px-0",
                      event?.phoneNumber === null && "hidden"
                    )}
                  >
                    <Telephone size={20} />
                  </Button>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      whatsapp();
                    }}
                    disabled={event?.whatsappNumber === null}
                    className={cn(
                      "text-black h-fit w-fit px-0",
                      event?.whatsappNumber === null && "hidden"
                    )}
                  >
                    <Whatsapp size={22} />
                  </Button>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      sendMail();
                    }}
                    disabled={event?.email === null}
                    className={cn(
                      "text-black h-fit w-fit px-0",
                      event?.email === null && "hidden"
                    )}
                  >
                    <EmailOutline size={22} />
                  </Button>
                </div>
              </div>

              <div className="w-full flex items-center justify-between">
                {Array.isArray(event?.pricing) && event?.pricing?.length > 0 ? (
                  <p className="font-semibold text-xl">{`${
                    currency ? currency : "₦"
                  }${price}`}</p>
                ) : (
                  <p className="font-semibold text-xl">Free</p>
                )}
                <div className="flex items-center gap-x-2">
                  <AboutWidget
                    Icon={Users}
                    text={`${event?.expectedParticipants ?? 0} participants`}
                  />
                  {availableSlot > 0 && (
                    <p className="text-red-600 bg-red-100 text-xs p-2 rounded-md">
                      {` ${availableSlot} slots left`}
                    </p>
                  )}
                </div>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  e.stopPropagation();

                  onClose();
                }}
                className="text-white font-medium bg-zikoro rounded-md h-14 w-full"
              >
                Book Now
              </Button>
              {!isAllSocialUnavailable && (
                <div className="w-full flex flex-col justify-start items-start space-y-2 ">
                  <h3>Learn more about the event organizers</h3>
                  <div className="flex items-center gap-x-2">
                    <Link
                      href={event?.x ? event?.x : "/"}
                      className={cn("block", event?.x === null && "hidden")}
                    >
                      <TwitterIcon />
                    </Link>
                    <Link
                      href={event?.linkedin ? event?.linkedin : "/"}
                      className={cn(
                        "block",
                        event?.linkedin === null && "hidden"
                      )}
                    >
                      <LinkedinIcon />
                    </Link>
                    <Link
                      href={event?.facebook ? event?.facebook : "/"}
                      className={cn(
                        "block",
                        event?.facebook === null && "hidden"
                      )}
                    >
                      <FacebookIcon />
                    </Link>
                    <Link
                      href={event?.instagram ? event?.instagram : "/"}
                      className={cn(
                        "block",
                        event?.instagram === null && "hidden"
                      )}
                    >
                      <InstagramIcon />
                    </Link>
                  </div>
                </div>
              )}
              <div className="w-full flex  justify-between items-center ">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShareDropDown();
                  }}
                  className="relative px-1 gap-x-3"
                >
                  <Share size={23} />
                  <h3 className="font-medium ">Share this Event</h3>
                  {isShareDropDown && (
                    <ActionModal
                      close={toggleShareDropDown}
                      eventId={eventId}
                      x={"https://twitter.com"}
                      linkedIn={"https://linkedIn.com"}
                      facebook={"https://www.fb.com"}
                      instagram={"https://www.instagram.com"}
                    />
                  )}
                </Button>
                {!isDetail && (
                  <Link
                    className="text-zikoro "
                    href={`/live-events/${event?.id}`}
                  >{`Read more >>`}</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </Comp>
      {isOpen && (
        <BookEvent
          event={event}
          eventDate={event?.startDateTime}
          endDate={endDate}
          address={event?.eventAddress}
          eventImage={
            Array.isArray(event?.eventPoster)
              ? event?.eventPoster[0]
              : "/images/rect.png"
          }
          availableSlot={availableSlot}
          startDate={startDate}
          currency={currency}
          organizerContact={organizerContact}
          eventTitle={event?.eventTitle}
          close={onClose}
          eventLocation={`${event?.eventCity ?? ""}${!removeComma && ","} ${
            event?.eventCountry ?? ""
          }`}
          eventId={eventId}
          organization={organization}
        />
      )}
    </>
  );
}

{
  /**
   



*/
}

{
  /**
   
*/
}

function ActionModal({
  close,
  instagram,
  eventId,
}: {
  x: string;
  facebook: string;
  eventId?: number;
  instagram: string;
  linkedIn: string;
  close: () => void;
}) {
  return (
    <>
      <div className="absolute left-0 top-10  w-48">
        <Button className="fixed inset-0 bg-none h-full w-full z-[100"></Button>
        <div
          role="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex relative z-[50]   flex-col py-4 items-start justify-start bg-white rounded-lg w-full h-fit shadow-lg"
        >
          <TwitterShareButton
            url={`https://zikoro-copy.vercel.app/live-events/${eventId}`}
          >
            <button className="items-center flex px-2  h-10 w-full gap-x-2 justify-start text-xs">
              <TwitterIcon />
              <span>X</span>
            </button>
          </TwitterShareButton>

          <LinkedinShareButton
            url={`https://zikoro-copy.vercel.app/live-events/${eventId}`}
          >
            <button
              className={
                "items-center h-10 gap-x-2 px-2 flex justify-start w-full  text-xs"
              }
            >
              <LinkedinIcon />
              <span>LinkedIn</span>
            </button>
          </LinkedinShareButton>
          <FacebookShareButton
            url={`https://zikoro-copy.vercel.app/live-events/${eventId}`}
          >
            <button
              className={
                "items-center h-10 gap-x-2 px-2 flex justify-start w-full  text-xs"
              }
            >
              <FacebookIcon />
              <span>Facebook</span>
            </button>
          </FacebookShareButton>
          <Link
            target="_blank"
            href={instagram}
            className={
              "items-center h-10 gap-x-2 px-2 flex justify-start w-full  text-xs"
            }
          >
            <InstagramIcon />
            <span>Instagram</span>
          </Link>
        </div>
      </div>
    </>
  );
}
