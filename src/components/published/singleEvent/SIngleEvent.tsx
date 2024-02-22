"use client";

import { TimeFive } from "@styled-icons/boxicons-solid/TimeFive";
import { LocationDot } from "@styled-icons/fa-solid/LocationDot";
import { CalendarDateFill } from "@styled-icons/bootstrap/CalendarDateFill";
import { CheckCircleFill, Telephone } from "styled-icons/bootstrap";
import { Whatsapp } from "styled-icons/remix-fill";
import { EmailOutline } from "styled-icons/evaicons-outline";
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
  isDateGreaterThanToday,
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
import { useRedeemDiscountCode } from "@/hooks";

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
  const {
    verifyDiscountCode,
    loading,
    minAttendees,
    discountAmount,
    discountPercentage,
  } = useRedeemDiscountCode();
  const [chosenPrice, setChosenPrice] = useState<number | undefined>();
  const [isShareDropDown, showShareDropDown] = useState(false);
  const [code, setCode] = useState("");
  const [priceCategory, setPriceCategory] = useState<string | undefined>("");
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

  /// restructure pricing array
  const pricingArray = useMemo(() => {
    if (Array.isArray(event?.pricing)) {
      return event?.pricing?.map((value) => {
        if (value?.earlyBird) {
          return {
            price:
              discountAmount !== null
                ? Number(value?.earlyBird) - Number(discountAmount)
                : Number(value?.earlyBird) -
                  (Number(value?.earlyBird) * Number(discountPercentage)) / 100,
            name: "Early Bird",
            date: value?.validity,
          };
        } else if (value?.standard) {
          return {
            price:
              discountAmount !== null
                ? Number(value?.standard) - Number(discountAmount)
                : Number(value?.standard) -
                  (Number(value?.standard) * Number(discountPercentage)) / 100,
            name: "Standard",
            date: value?.validity,
          };
        } else {
          if (!value?.lateBird) return;
          return {
            price:
              discountAmount !== null
                ? Number(value?.lateBird) - Number(discountAmount)
                : Number(value?.lateBird) -
                  (Number(value?.lateBird) * Number(discountPercentage)) / 100,
            name: "Late Bird",
            date: value?.validity,
          };
        }
      });
    }
  }, [event?.pricing, discountAmount, discountPercentage]);

  function activeSelectedPrice(selected: string | undefined) {
    return selected === priceCategory;
  }

  function toggleShareDropDown() {
    showShareDropDown((prev) => !prev);
  }

  function selectedPrice(value: number | undefined) {
    setChosenPrice(value);
  }

  function selectedPriceCategory(value: string | undefined) {
    if (priceCategory === undefined && priceCategory !== value) {
      setPriceCategory(undefined);
    } else {
      setPriceCategory(value);
    }
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

  /// verifying and redeeming a discount code'
  async function redeem() {
    await verifyDiscountCode(code, String(eventId));
    // setCode("")
  }

  const organizerContact: OrganizerContact = {
    whatsappNumber: event?.whatsappNumber,
    phoneNumber: event?.phoneNumber,
    email: event?.email,
  };

  return (
    <>
      <Comp
        disabled={isExpired}
        onClick={() => router.push(`/live-events/${event?.eventAlias}`)}
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
                      <p className="text-xs bg-gray-100 rounded-md p-2 ">
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
                  <p>
                    {`${event?.eventCity ?? ""}`}
                    {!removeComma && <span>,</span>}
                    {`${event?.eventCountry ?? ""}`}
                  </p>
                }
              />

              <div className="w-full space-y-2 flex flex-col items-start justify-start">
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
                      "text-zikoro bg-transparent h-12 gap-x-2 border border-zikoro",
                      event?.phoneNumber === null && "hidden"
                    )}
                  >
                    <Telephone size={22} />
                    <span>Phone Call</span>
                  </Button>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      whatsapp();
                    }}
                    disabled={event?.whatsappNumber === null}
                    className={cn(
                      "text-zikoro bg-transparent h-12 gap-x-2 border border-zikoro",
                      event?.whatsappNumber === null && "hidden"
                    )}
                  >
                    <Whatsapp size={22} />
                    <span>WhatsApp</span>
                  </Button>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      sendMail();
                    }}
                    disabled={event?.email === null}
                    className={cn(
                      "text-zikoro bg-transparent h-12 gap-x-2 border border-zikoro",
                      event?.email === null && "hidden"
                    )}
                  >
                    <EmailOutline size={22} />
                    <span>Email</span>
                  </Button>
                </div>
              </div>

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
            </div>

            <div className="w-full flex lg:col-span-3 flex-col items-start justify-start gap-y-4">
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
              <div className="grid grid-cols-3 gap-1 items-center w-full">
                {Array.isArray(pricingArray) &&
                  pricingArray &&
                  pricingArray?.map((v) => {
                    if (v) {
                      return (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            selectedPrice(v?.price);
                            selectedPriceCategory(v?.name);
                          }}
                          disabled={isDateGreaterThanToday(v?.date)}
                          className={cn(
                            "flex flex-col group relative rounded-lg items-start justify-start  border p-2 h-full w-full",
                            isDateGreaterThanToday(v?.date)
                              ? ""
                              : "hover:border-zikoro border-black",

                            activeSelectedPrice(v?.name) && "border-zikoro"
                          )}
                        >
                          {isDateGreaterThanToday(v?.date) && (
                            <div className="w-full h-full absolute inset-0 bg-white/50"></div>
                          )}
                          <div className="flex items-center justify-between w-full">
                            <p className="font-medium text-[13px]">{`${
                              currency ? currency : "₦"
                            }${(Number(v?.price) ?? 0)?.toLocaleString()}`}</p>

                            {!isDateGreaterThanToday(v?.date) && (
                              <div
                                className={cn(
                                  "hidden group-hover:block",

                                  activeSelectedPrice(v?.name) && "block"
                                )}
                              >
                                <CheckCircleFill
                                  className=" text-zikoro"
                                  size={20}
                                />
                              </div>
                            )}
                          </div>
                          <div
                            className={cn(
                              " text-[10px] flex flex-col justify-start rounded-md items-start",
                              isDateGreaterThanToday(v?.date)
                                ? "text-gray-500"
                                : "text-black"
                            )}
                          >
                            <p>{v?.name}</p>
                            {v?.date ? (
                              <p>{`Valid till ${v?.date}`}</p>
                            ) : (
                              <p className="w-1 h-1"></p>
                            )}
                          </div>
                        </Button>
                      );
                    }
                    return null;
                  })}
              </div>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="w-full flex flex-col gap-y-2 items-start justify-start"
              >
                <div className="w-full flex items-center ">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter a valid discount code"
                    className="bg-transparent h-14 rounded-l-md px-3 outline-none placeholder:text-gray-300 border border-gray-300 w-[75%]"
                  />
                  <Button
                    disabled={code === ""}
                    onClick={redeem}
                    className="h-14 text-white rounded-r-md rounded-l-none bg-gray-500 font-medium px-0 w-[25%]"
                  >
                    {loading ? "Verifying..." : "Redeem"}
                  </Button>
                </div>
              </div>
              <Button
                disabled={priceCategory === ""}
                onClick={(e) => {
                  e.stopPropagation();
                  e.stopPropagation();
                  console.log("clicked", onClose);
                  onClose();
                }}
                className="text-white font-medium bg-zikoro rounded-md h-14 w-full"
              >
                Book Now
              </Button>
              <div className="w-full flex flex-col justify-start items-start space-y-2">
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
              </div>
            </div>
          </div>

          {!isDetail && (
            <Link
              className="text-zikoro "
              href={`/live-events/${event?.eventAlias}`}
            >{`Read more >>`}</Link>
          )}
        </div>
      </Comp>
      {isOpen && (
        <BookEvent
          eventDate={event?.startDateTime}
          endDate={endDate}
          discountCode={code}
          address={event?.eventAddress}
          eventImage={
            event?.eventPoster ? event?.eventPoster?.image1 : "/images/rect.png"
          }
          discountAmount={discountAmount}
          discountPercentage={discountPercentage}
          startDate={startDate}
          currency={currency}
          organizerContact={organizerContact}
          priceCategory={priceCategory}
          minimumAttendees={minAttendees}
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
