"use client";

import { TimeFive } from "@styled-icons/boxicons-solid/TimeFive";
import { LocationDot } from "@styled-icons/fa-solid/LocationDot";
import { CalendarDateFill } from "@styled-icons/bootstrap/CalendarDateFill";
import { CheckCircleFill, Telephone } from "styled-icons/bootstrap";
import { Whatsapp } from "styled-icons/remix-fill";
import { EmailOutline } from "styled-icons/evaicons-outline";
import { Button } from "@/components";
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
  isDateGreaterThanToday,
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
import { Event } from "@/types";

export function SingleEvent({
  className,
  isDetail,
  event,
  useDiv = false,
  organization,
  eventId,
}: {
  isDetail?: boolean;
  className?: string;
  event?: Event;
  organization?: string | null;
  eventId?: number;
  useDiv?: boolean;
}) {
  const Comp = useDiv ? "div" : "button";
  const [isOpen, setOpen] = useState(false);
  const [chosenPrice, setChosenPrice] = useState<number | undefined>(10000);
  const [priceCategory, setPriceCategory] = useState<string | undefined>("");
  const router = useRouter();

  function onClose() {
    if (isDetail) return;
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

  /// restructure pricing array
  const pricingArray = useMemo(() => {
    if (Array.isArray(event?.pricing)) {
      return event?.pricing?.map((value) => {
        if (value?.earlyBird) {
          return {
            price: value?.earlyBird,
            name: "Early Bird",
            date: value?.validity,
          };
        } else if (value?.standard) {
          return {
            price: value?.standard,
            name: "Standard",
            date: value?.validity,
          };
        } else {
          return {
            price: value?.lateBird,
            name: "Late Bird",
            date: value?.validity,
          };
        }
      });
    }
  }, [event?.pricing]);

  function activeSelectedPrice(selected: number | undefined) {
    return selected === chosenPrice;
  }

  function selectedPrice(value: number | undefined) {
    if (chosenPrice !== undefined && chosenPrice === value) {
      setChosenPrice(undefined);
    } else {
      setChosenPrice(value);
    }
  }

  const removeComma = useMemo(() => {
    return event?.eventCity === null || event?.eventCountry === null;
  }, [event?.eventCity, event?.eventCountry]);

  return (
    <>
      <Comp
        disabled={isExpired}
        onClick={() => router.push(`/events/${event?.id}`)}
        className={cn("w-full h-fit")}
      >
        <div
          className={cn(
            "w-full flex flex-col justify-start items-start gap-y-4 bg-white rounded-2xl  shadow h-fit py-4 px-4 sm:px-10 sm:py-6",
            isExpired && "relative",
            className
          )}
        >
          <EventLocationType
            locationType={event?.locationType}
            className="w-fit px-4 h-10 text-xs"
          />
          {isExpired && (
            <div className="w-full h-full inset-0 absolute z-10 bg-white/50"></div>
          )}
          <div className="w-full grid grid-cols-1 lg:grid-cols-7 items-start">
            <div className="w-full lg:col-span-4 flex flex-col gap-y-4 items-start justify-start">
              <p className="text-base sm:text-xl font-medium mb-4 ">
                {event?.eventTitle}
              </p>
              <AboutWidget
                Icon={CalendarDateFill}
                text={
                  <div className="flex items-center gap-x-2">
                    <p>{`${startDate} – ${endDate}`}</p>
                    {timeDifference && (
                      <p className="text-xs bg-gray-200 rounded-md p-2 ">
                        {timeDifference}
                      </p>
                    )}
                  </div>
                }
              />
              <AboutWidget Icon={TimeFive} text={`${startTime} - ${endTime}`} />
              <AboutWidget
                Icon={LocationDot}
                text={
                  <p>{`${event?.eventCity ?? ""}${!removeComma && ","} ${
                    event?.eventCountry ?? ""
                  }`}</p>
                }
              />

              <div className="w-full space-y-2 flex flex-col items-start justify-start">
                <h3>Speak with the Event Team</h3>

                <div className="flex items-center gap-x-2">
                  <Button
                    onClick={phoneCall}
                    disabled={event?.phoneNumber === null}
                    className="text-zikoro bg-transparent h-12 gap-x-2 border border-zikoro"
                  >
                    <Telephone size={22} />
                    <span>Phone Call</span>
                  </Button>
                  <Button
                    onClick={whatsapp}
                    disabled={event?.whatsappNumber === null}
                    className="text-zikoro bg-transparent h-12 gap-x-2 border border-zikoro"
                  >
                    <Whatsapp size={22} />
                    <span>Whatsapp</span>
                  </Button>
                  <Button
                    onClick={sendMail}
                    disabled={event?.email === null}
                    className="text-zikoro bg-transparent h-12 gap-x-2 border border-zikoro"
                  >
                    <EmailOutline size={22} />
                    <span>Email</span>
                  </Button>
                </div>
              </div>

              <div className="w-full flex flex-col justify-start items-start space-y-2 ">
                <h3>Learn more about the event organizers</h3>
                <div className="flex items-center gap-x-2">
                  <Link href={event?.twitter ? event?.twitter : "/"}>
                    <TwitterIcon />
                  </Link>
                  <Link href={event?.linkedin ? event?.linkedin : "/"}>
                    {" "}
                    <LinkedinIcon />
                  </Link>
                  <Link href={event?.facebook ? event?.facebook : "/"}>
                    {" "}
                    <FacebookIcon />
                  </Link>
                  <Link href={event?.instagram ? event?.instagram : "/"}>
                    {" "}
                    <InstagramIcon />
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full flex lg:col-span-3 flex-col items-start justify-start gap-y-4">
              <div className="flex items-center gap-x-2">
                <AboutWidget
                  Icon={Users}
                  text={`${event?.expectedParticipants ?? 0} participants`}
                />
                <p className="text-red-600 bg-red-100 text-xs p-2 rounded-md">
                  12 slots left
                </p>
              </div>
              <div className="grid grid-cols-3 gap-1 items-center w-full">
                {pricingArray?.map(({ name, price, date }) => (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectedPrice(price);
                      setPriceCategory(name);
                    }}
                    disabled={isDateGreaterThanToday(date)}
                    className={cn(
                      "flex flex-col group relative rounded-lg items-start justify-start  border p-2 h-full w-full",
                      isDateGreaterThanToday(date)
                        ? ""
                        : "hover:border-zikoro border-black",

                      activeSelectedPrice(price) && "border-zikoro"
                    )}
                  >
                    {isDateGreaterThanToday(date) && (
                      <div className="w-full h-full absolute inset-0 bg-white/50"></div>
                    )}
                    <div className="flex items-center justify-between w-full">
                      <p className="font-medium text-[13px]">{`₦${(
                        price ?? 0
                      )?.toLocaleString()}`}</p>

                      {!isDateGreaterThanToday(date) && (
                        <div
                          className={cn(
                            "hidden group-hover:block",

                            activeSelectedPrice(price) && "block"
                          )}
                        >
                          <CheckCircleFill className=" text-zikoro" size={20} />
                        </div>
                      )}
                    </div>
                    <div
                      className={cn(
                        " text-[10px] flex flex-col justify-start rounded-md items-start",
                        isDateGreaterThanToday(date)
                          ? "text-gray-500"
                          : "text-black"
                      )}
                    >
                      <p>{name}</p>
                      {date ? (
                        <p>{`Valid till ${date}`}</p>
                      ) : (
                        <p className="w-1 h-1"></p>
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              <div className="w-full flex flex-col gap-y-2 items-start justify-start">
                <div className="w-full flex items-center ">
                  <input
                    type="text"
                    placeholder="Enter a valid discount code"
                    className="bg-transparent h-14 rounded-l-md px-3 outline-none placeholder:text-gray-300 border border-gray-300 w-[75%]"
                  />
                  <Button className="h-14 text-white rounded-r-md rounded-l-none bg-gray-500 font-medium px-0 w-[25%]">
                    Redeem
                  </Button>
                </div>
              </div>
              <Button
                disabled={chosenPrice === undefined}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-white font-medium bg-zikoro rounded-md h-14 w-full"
              >
                Book Now
              </Button>
              <div className="w-full flex flex-col justify-start items-start space-y-2">
                <h3 className="font-medium">SHARE THIS EVENT</h3>
                <div className="flex items-center gap-x-2">
                  <TwitterIcon />
                  <LinkedinIcon />
                  <FacebookIcon />
                  <InstagramIcon />
                </div>
              </div>
            </div>
          </div>

          {!isDetail && (
            <Link
              className="text-zikoro "
              href={`/events/${event?.id}`}
            >{`Read more >>`}</Link>
          )}
        </div>
      </Comp>
      {isOpen && (
        <BookEvent
          eventDate={event?.startDateTime}
          endDate={endDate}
          startDate={startDate}
          priceCategory={priceCategory}
          eventTitle={event?.eventTitle}
          close={onClose}
          eventLocation={`${event?.eventCity ?? ""}${!removeComma && ","} ${
            event?.eventCountry ?? ""
          }`}
          eventId={eventId}
          organization={organization}
          price={chosenPrice}
        />
      )}
    </>
  );
}
