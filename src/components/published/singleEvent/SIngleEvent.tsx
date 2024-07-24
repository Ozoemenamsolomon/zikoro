"use client";

import { TimeFive } from "styled-icons/boxicons-solid";
import { LocationDot } from "styled-icons/fa-solid";
import { CalendarDateFill } from "styled-icons/bootstrap";
import { Telephone } from "styled-icons/bootstrap";
import { Whatsapp } from "styled-icons/remix-fill";
import { EmailOutline } from "styled-icons/evaicons-outline";
import Image from "next/image";
import { Button } from "@/components";
import { Share } from "styled-icons/bootstrap";
import { LinkedinShareButton } from "next-share";
import { EventLocationType, AboutWidget } from "@/components/composables";
import Link from "next/link";
import { cn } from "@/lib";
import { Users } from "styled-icons/fa-solid";
import useUserStore from "@/store/globalUserStore";
import {
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
import { usePathname, useRouter } from "next/navigation";
import { Event, OrganizerContact } from "@/types";
import { useFetchSingleOrganization, getCookie, useFormatEventData } from "@/hooks";
import { toast } from "@/components/ui/use-toast";

export function SingleEvent({
  className,
  isDetail,
  event,
  useDiv = false,
  eventId,
  imageClassName,
  organizationLogo,
}: {
  isDetail?: boolean;
  className?: string;
  event?: Event;
  organization?: string | null;
  eventId?: string;
  useDiv?: boolean;
  imageClassName?: string;
  organizationLogo?:string;
}) {
  const Comp = useDiv ? "div" : "button";
  const [isOpen, setOpen] = useState(false);
  const {user} = useUserStore()
  const [isShareDropDown, showShareDropDown] = useState(false);
  const pathname = usePathname()
  const org = getCookie("currentOrganization");
  const {startDate,endDate, startTime, endTime } = useFormatEventData(event)
  const { data } = useFetchSingleOrganization(org?.id);
  const router = useRouter();

  function onClose() {
    // if (isDetail) return;
    setOpen((prev) => !prev);
  }



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
    window.open(`tel:${data?.eventPhoneNumber}`, "_blank");
  }
  // chat on whatsapp
  function whatsapp() {
    window.open(`https://wa.me/${data?.eventWhatsApp}`, "_blank");
  }

  // send mail
  function sendMail() {
    window.open(`mailto:${data?.organizationOwner}`, "_blank");
  }

  function toggleShareDropDown() {
    showShareDropDown((prev) => !prev);
  }

  // conditonally adding comma to separate city and location
  const removeComma = useMemo(() => {
    return event?.eventCity === null || event?.eventCountry === null;
  }, [event?.eventCity, event?.eventCountry]);



  const isAllSocialUnavailable = useMemo(() => {
    return (
      data?.x === null &&
      data?.instagram === null &&
      data?.linkedIn === null &&
      data?.facebook === null
    );
  }, [data?.x, data?.instagram, data?.linkedIn, data?.facebook]);

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
    whatsappNumber: data?.eventWhatsApp,
    phoneNumber: data?.eventPhoneNumber,
    email: data?.eventContactEmail,
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
        onClick={() => router.push(`/live-events/${event?.eventAlias}`)}
        className={cn("w-full h-fit")}
      >
        <div
          className={cn(
            "w-full flex flex-col justify-start items-start  gap-y-4 bg-white rounded-2xl  shadow h-fit ",
            isExpired && "relative",
            className
          )}
        >
          {isExpired && (
            <div className="w-full h-full inset-0 absolute z-10 bg-white/50"></div>
          )}
          <div className={cn("w-full grid grid-cols-1 h-fit gap-4 lg:grid-cols-8 items-start", isDetail && "lg:grid-cols-1")}>
            <div className={cn("w-full h-72 sm:h-[350px] relative lg:h-[400px] flex lg:col-span-4 flex-col items-start justify-start",
            isDetail && "sm:h-[400px] lg:h-[500px]"
            )}>
              {event?.eventPoster ? (
                <Image
                  src={event?.eventPoster}
                  alt="event-image"
                  width={600}
                  height={600}
                  className={cn(
                    "w-full h-72 sm:h-[350px] lg:h-[400px] rounded-t-2xl sm:rounded-tr-none sm:rounded-l-2xl object-cover",
                    isDetail && "sm:h-[400px] lg:h-[500px]",
                    imageClassName
                  )}
                />
              ) : (
                <div className="w-full h-full rounded-t-2xl sm:rounded-tr-none sm:rounded-l-2xl  animate-pulse">
                  <div className="w-full h-full bg-gray-200"></div>
                </div>
              )}
              <div className={cn("absolute left-10 bottom-0 bg-white px-3 py-2 rounded-t-lg hidden", isDetail && "block")}>
              <Image
              src={organizationLogo || "/logo.png"}
              alt="logo"
              width={300}
              height={300}
              className="w-fit h-fit max-h-[40px]"
            />
              </div>
            </div>
            {/** */}
            <div className={cn("w-full lg:col-span-4 flex flex-col gap-y-3 py-4 px-4 sm:px-10 sm:py-6 items-start justify-start", isDetail && "mx-auto lg:col-span-1 max-w-2xl")}>
             <div className="flex w-full items-center justify-between">
             <p className="text-base text-start w-full  sm:text-2xl font-medium  ">
                {event?.eventTitle}
              </p>
                <Button className="text-white bg-basePrimary h-10 text-sm rounded-3xl">{event?.locationType}</Button>
             </div>
              <div className="flex items-center justify-between w-full">
                <AboutWidget
                  Icon={CalendarDateFill}
                  text={
                    <div className="flex items-center gap-x-2">
                      <p className="flex items-center gap-x-1">
                        {`${startDate} `}{" "}
                        <span className="hidden md:block">{`- ${endDate}`}</span>
                      </p>
                      {timeDifference && (
                        <p className="text-xs bg-gray-100 rounded-md p-2 ">
                          {timeDifference}
                        </p>
                      )}
                    </div>
                  }
                />
              {/*  <EventLocationType
                  locationType={event?.locationType}
                  className="w-fit px-4 h-10 text-xs"
                />*/}
              </div>
              <AboutWidget Icon={TimeFive} text={`${startTime} - ${endTime}`} />
              <AboutWidget
                Icon={LocationDot}
                text={
                  <p>
                    {`${event?.eventCity ?? ""}`}
                    {!removeComma && <span>,</span>}
                    {` ${event?.eventCountry ?? ""}`}
                  </p>
                }
              />

              

              <div className="w-full flex items-center justify-between">
                {Array.isArray(event?.pricing) && event?.pricing?.length > 0 && Number(price) > 0 ? (
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
                className="text-white font-medium bg-basePrimary rounded-md h-14 w-full"
              >
                Book Now
              </Button>
              {!isAllSocialUnavailable && (
                <div className="w-full hidden flex-col justify-start items-start space-y-2 ">
                  <h3>Learn more about the event organizers</h3>
                  <div className="flex items-center gap-x-2">
                    <Link
                      href={data?.x ? data?.x : "/"}
                      className={cn("block", data?.x === null && "hidden")}
                    >
                      <TwitterIcon />
                    </Link>
                    <Link
                      href={data?.linkedIn ? data?.linkedIn : "/"}
                      className={cn(
                        "block",
                        data?.linkedIn === null && "hidden"
                      )}
                    >
                      <LinkedinIcon />
                    </Link>
                    <Link
                      href={data?.facebook ? data?.facebook : "/"}
                      className={cn(
                        "block",
                        data?.facebook === null && "hidden"
                      )}
                    >
                      <FacebookIcon />
                    </Link>
                    <Link
                      href={data?.instagram ? data?.instagram : "/"}
                      className={cn(
                        "block",
                        data?.instagram === null && "hidden"
                      )}
                    >
                      <InstagramIcon />
                    </Link>
                  </div>
                </div>
              )}
              <div className={cn("w-full flex  justify-between items-start flex-col gap-3 ", isDetail && "flex-col sm:flex-row items-start sm:items-center")}>
              <div className=" flex items-center gap-x-6 justify-start">
                <h3>Speak with the Event Team</h3>

                <div className={cn("flex items-center gap-x-2", pathname.includes("preview") && "hidden")}>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      phoneCall();
                    }}
                    className={cn("text-black h-fit w-fit px-0")}
                  >
                    <Telephone size={20} />
                  </Button>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      whatsapp();
                    }}
                    className={cn("text-black h-fit w-fit px-0")}
                  >
                    <Whatsapp size={22} />
                  </Button>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      sendMail();
                    }}
                    className={cn("text-black h-fit w-fit px-0")}
                  >
                    <EmailOutline size={22} />
                  </Button>
                </div>
              </div>
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
                    />
                  )}
                </Button>
                {/*!isDetail && (
                  <Link
                    className="text-basePrimary "
                    href={`/live-events/${event?.eventAlias}`}
                  >{`Read more >>`}</Link>
                )*/}
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
          eventImage={event?.eventPoster}
          availableSlot={availableSlot}
          startDate={startDate}
          currency={event?.pricingCurrency}
          organizerContact={organizerContact}
          eventTitle={event?.eventTitle}
          close={onClose}
          eventLocation={`${event?.eventCity ?? ""}${!removeComma && ","} ${
            event?.eventCountry ?? ""
          }`}
          eventId={eventId}
          organization={org?.name}
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

// https://www.linkedin.com/sharing/share-offsite/?url=
function ActionModal({
  close,
  eventId,
}: {
  eventId?: string;
  instagram?: string;
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
          className="flex relative z-[50] flex-col py-4 items-start justify-start bg-white rounded-lg w-full h-fit shadow-lg"
        >
          <button
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?url=https://zikoro-git-integrate-ajax484s-projects.vercel.app/live-events/${eventId}`,
                "_blank"
              )
            }
            className="items-center flex px-2  h-10 w-full gap-x-2 justify-start text-xs"
          >
            <TwitterIcon />
            <span>X</span>
          </button>

          <LinkedinShareButton
            url={`https://zikoro-git-integrate-ajax484s-projects.vercel.app/live-events/${eventId}`}
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
          <button
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=https://zikoro-git-integrate-ajax484s-projects.vercel.app/live-events/${eventId}`,
                "_blank"
              )
            }
            className={
              "items-center h-10 gap-x-2 px-2 flex justify-start w-full  text-xs"
            }
          >
            <FacebookIcon />
            <span>Facebook</span>
          </button>
          <Link
            target="_blank"
            href={""}
            className={
              "items-center hidden h-10 gap-x-2 px-2  justify-start w-full  text-xs"
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
