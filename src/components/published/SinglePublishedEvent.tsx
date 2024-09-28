"use client";

import {
  EventDetail,
  SinglePublishedEventAttendeeWidget,
} from "@/components/published";
import Link from "next/link";
import { Button } from "@/components";
import {
  useFetchSingleEvent,
  useFetchSingleOrganization,
  useVerifyUserAccess,
  useFormatEventData,
} from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { usePathname, useSearchParams } from "next/navigation";
import { InlineIcon } from "@iconify/react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  IconifyEventSocialPhoneIcon,
  IconifyEventSocialWhatsappIcon,
  IconifyPublishdEventTimeIcon,
  IconifyPublishedEventCalendarIcon,
  IconifyPublishedEventLocationIcon,
  IconifyPublishedEventPeopleIcon,
  IconifyShareIcon,
  IconEventSocialEmailIcon,
} from "@/constants";

import {
  calculateTimeDifference,
  hasTimeElapsed,
  COUNTRIES_CURRENCY,
  geocodeAddress,
} from "@/utils";
import { TOrgEvent } from "@/types";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";

function AboutEvent({
  event,
  coordinates,
}: {
  event: TOrgEvent;
  coordinates: { lat: number; lng: number } | null;
}) {
  const timeDifference = useMemo(
    () => calculateTimeDifference(event?.startDateTime, event?.endDateTime),
    [event?.startDateTime ?? "0", event?.endDateTime ?? "0"]
  );

  // conditonally adding comma to separate city and location
  const removeComma = useMemo(() => {
    return event?.eventCity === null || event?.eventCountry === null;
  }, [event?.eventCity, event?.eventCountry]);
  const { startDate, endDate, startTime, endTime } = useFormatEventData(event);
  return (
    <>
      <div className="w-full mt-2 flex items-center gap-x-3">
        <IconifyPublishedEventCalendarIcon />
        <div className="space-y-1">
          <p className="w-fit px-2 py-1 text-xs sm:text-mobile bg-gray-100 border border-gray-500 rounded-3xl">
            {timeDifference}
          </p>

          <div className="flex items-center gap-x-2">
            <p className="flex items-center gap-x-1">
              {`${startDate} `}
              <span className="">{`- ${endDate}`}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center gap-x-3">
        <IconifyPublishdEventTimeIcon />
        <div className="flex items-center gap-x-2">
          <p className="flex items-center gap-x-1">
            {`${startTime} `}
            <span className="">{`- ${endTime}`}</span>
          </p>
        </div>
      </div>
      <div className="w-full flex items-center gap-x-3">
        <IconifyPublishedEventLocationIcon />
        <div className="flex flex-col items-start justify-start">
          <p className="font-medium flex items-center">
            {event?.eventAddress ?? ""}{" "}
            {coordinates && (
              <Link
                target="_blank"
                href={`https://www.google.com/maps/dir//${event?.eventAddress}/@${coordinates?.lat},${coordinates?.lng},15z?hl=en-US&entry=ttu`}
                title="View Direction"
              >
                <InlineIcon
                  icon={"material-symbols-light:arrow-insert"}
                  fontSize={18}
                  className="rotate-90"
                />
              </Link>
            )}
          </p>
          <p className="text-xs sm:text-mobile">
            {`${event?.eventCity ?? ""}`}
            {!removeComma && <span>,</span>}
            {` ${event?.eventCountry ?? ""}`}
          </p>
        </div>
      </div>
    </>
  );
}

export default function SinglePublishedEvent({ id }: { id: string }) {
  const params = useSearchParams();
  const trackingId = params.get("trackingId");
  const affiliateCode = params.get("affiliateCode");
  const role = params.get("role");
  const { data: eventDetail } = useFetchSingleEvent(id);
  const { eventAttendees } = useVerifyUserAccess(id);
  const { data, refetch } = useFetchSingleOrganization(
    eventDetail?.organization?.id
  );
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  const pathname = usePathname();
  // console.log(id)
  // useValidateUser()

  useEffect(() => {
    if (eventDetail?.organization) {
      refetch();
    }
  }, [eventDetail]);

  const isExpired = useMemo(
    () => hasTimeElapsed(eventDetail?.endDateTime),
    [eventDetail?.endDateTime ?? "0"]
  );

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
    if (eventDetail?.pricingCurrency) {
      const symbol =
        COUNTRIES_CURRENCY.find(
          (v) => String(v.code) === String(eventDetail?.pricingCurrency)
        )?.symbol ?? "₦";
      return symbol;
    }
  }, [eventDetail?.pricingCurrency]);

  // calculating the difference between the expected participants and  registered participants
  const availableSlot = useMemo(() => {
    return (
      Number(eventDetail?.expectedParticipants) -
      Number(eventDetail?.registered)
    );
  }, [eventDetail?.expectedParticipants, eventDetail?.registered]);

  // call phone
  function phoneCall() {
    window.open(`tel:${eventDetail?.organization?.eventPhoneNumber}`, "_blank");
  }
  // chat on whatsapp
  function whatsapp() {
    window.open(
      `https://wa.me/${eventDetail?.organization?.eventWhatsApp}`,
      "_blank"
    );
  }

  // send mail
  function sendMail() {
    window.open(
      `mailto:${eventDetail?.organization?.organizationOwner}`,
      "_blank"
    );
  }

  const price = useMemo(() => {
    if (Array.isArray(eventDetail?.pricing)) {
      const prices = eventDetail?.pricing?.map(({ price }) => Number(price));
      const lowestPrice = Math.min(...prices);

      return lowestPrice.toLocaleString(undefined, {
        maximumFractionDigits: 0,
      });
    } else {
      return "";
    }
  }, [eventDetail?.pricing]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!eventDetail) return;
      try {
        const { lat, lng } = await geocodeAddress(eventDetail?.eventAddress);
        setCoordinates({ lat, lng });
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, [event]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  return (
    <>
      {eventDetail ? (
        <div className="w-full h-full fixed overflow-y-auto bg-[#F7F8FF]">
          <div className="w-full px-4 sm:px-6 md:px-10 flex items-center justify-between p-3 sm:p-4 border-b border-[#EAEAEA]">
            <Image 
              src="/zikoro.png"
              alt=""
              className="max-w-[150px] max-h-[50px]"
              width={160}
              height={70}
            />
            <div className="flex items-center gap-x-2">
              <Link className="text-xs sm:text-sm" href="">
                Explore other events
              </Link>
              <Link
                href=""
                className="bg-basePrimary text-white text-xs sm:text-sm rounded-lg w-fit px-2 py-3"
              >
                Try Zikoro
              </Link>
            </div>
          </div>
          <div className="w-full mt-6 sm:mt-10 grid grid-cols-1 items-start lg:grid-cols-2 gap-6 sm:gap-10 px-4 sm:px-6 md:px-10 xl:px-14 2xl:px-20">
            <div className="w-full">
              {eventDetail?.eventPoster ? (
                <Image
                  src={eventDetail?.eventPoster}
                  alt="poster"
                  className="w-full rounded-lg object-cover h-full max-h-[350px] sm:max-h-[500px]"
                  width={2000}
                  height={1000}
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-gray-200 animate-pulse "></div>
              )}

              <div className="w-full flex gap-y-6 flex-col items-start justify-start mt-4 sm:mt-6">
                <p>Event Organizer </p>

                <div className="flex items-center gap-x-2">
                  {eventDetail?.organization?.organizationLogo &&
                  eventDetail?.organization?.organizationLogo?.startsWith(
                    "https"
                  ) ? (
                    <Image
                      src={eventDetail?.organization?.organizationLogo}
                      className="max-h-[40px] max-w-[100px]"
                      alt=""
                      width={200}
                      height={200}
                    />
                  ) : (
                    <div className="w-[60px] h-[60px] bg-gray-200 rounded-full flex items-center justify-center">
                      <p className="text-sm gradient-text bg-basePrimary font-medium">
                        Logo
                      </p>
                    </div>
                  )}
                  <p>{eventDetail?.organization?.organizationName ?? ""}</p>
                </div>
                <div className="flex w-full flex-col items-start justify-start gap-y-3">
                  <p>See people attending 👀</p>

                  <div className="flex w-full items-center justify-between">
                    {eventAttendees && (
                      <SinglePublishedEventAttendeeWidget
                        attendees={eventAttendees}
                      />
                    )}
                    <button className="flex items-center gap-x-1">
                      <span>Share Event</span>

                      <IconifyShareIcon />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="w-full rounded-lg grid grid-cols-1 gap-3 bg-white p-3 h-full">
                <div className="w-full flex flex-col gap-y-2 items-start justify-start ">
                  <div className="w-fit px-3 py-2 bg-gradient-to-tr border rounded-2xl border-[#001fcc] from-custom-bg-gradient-start to-custom-bg-gradient-end">
                    <p className="gradient-text bg-basePrimary text-xs sm:text-sm">
                      {eventDetail?.locationType ?? ""}
                    </p>
                  </div>
                  <h2 className="font-semibold text-lg sm:text-2xl ">
                    {eventDetail?.eventTitle ?? ""}
                  </h2>
                  {eventDetail && (
                    <AboutEvent event={eventDetail} coordinates={coordinates} />
                  )}
                  {eventDetail?.locationType?.toLowerCase() !== "remote" &&
                  isLoaded &&
                  coordinates !== null ? (
                    <GoogleMap
                      mapContainerStyle={{
                        width: "100%",
                        height: "150px",
                        borderRadius: "1rem",
                      }}
                      center={coordinates}
                      zoom={15}
                    >
                      <Marker
                        position={coordinates}
                        onClick={() => setInfoWindowOpen(true)}
                      >
                        {infoWindowOpen && (
                          <InfoWindow
                            position={coordinates}
                            onCloseClick={() => setInfoWindowOpen(false)}
                          >
                            <div>{eventDetail?.eventAddress}</div>
                          </InfoWindow>
                        )}
                      </Marker>
                    </GoogleMap>
                  ) : (
                    <div>Loading...</div>
                  )}

                  <div className="w-full h-fit sm:h-full max-h-[200px] rounded-lg border p-2">
                    <h3 className="pb-2 w-full text-center border-b">
                      Register for this event
                    </h3>
                    <div className="flex flex-col items-center py-3 justify-center gap-y-3">
                      <div className="flex items-center gap-x-2">
                        <IconifyPublishedEventPeopleIcon />
                        <p>
                          {" "}
                          <span className="font-medium">
                            {eventDetail?.expectedParticipants}
                          </span>{" "}
                          Attendees
                        </p>
                        <div className="bg-red-600 text-white font-medium relative h-10 text-center rounded-sm px-3 py-2 text-mobile sm:text-sm">
                          <InlineIcon
                            icon="bxs:left-arrow"
                            color="#dc2626"
                            fontSize={20}
                            className="absolute top-2 -left-[10px]"
                          />
                          {availableSlot} slots left
                        </div>
                      </div>
                      <div className="flex items-center gap-x-2">
                        Ticket price starting from{" "}
                        <span className="font-medium">
                          {currency}
                          {price}
                        </span>
                      </div>

                      <Button className="rounded-lg w-fit font-medium bg-basePrimary text-white">
                        Get Ticket
                      </Button>
                    </div>
                  </div>
                  <div className="w-full h-fit  rounded-lg border p-2">
                    <h3 className="pb-2 w-full text-center border-b">
                      Contact Organizer
                    </h3>
                    <div className="flex w-full items-center py-4 justify-center gap-x-3">
                      <button onClick={whatsapp}>
                        <IconifyEventSocialWhatsappIcon />
                      </button>
                      <button onClick={phoneCall}>
                        <IconifyEventSocialPhoneIcon />
                      </button>
                      <button onClick={sendMail}>
                        <IconEventSocialEmailIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full">
              {eventDetail &&  <EventDetail event={eventDetail}/>}

              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center">
          <LoaderAlt size={30} className="animate-spin" />
        </div>
      )}
    </>
  );
}

/**
    <SingleEvent
            affiliateCode={affiliateCode}
            trackingId={trackingId}
            role={role}
            isDetail={true}
            organization={eventDetail?.organisationName}
            organizationLogo={data?.organizationLogo}
            event={eventDetail}
            useDiv={true}
            eventId={eventDetail?.eventAlias}
            imageClassName={
              "rounded-t-none sm:rounded-l-none rounded-tr-none sm:rounded-tl-none sm:rounded-l-none"
            }
            className="w-full bg-none  shadow-none"
          />
         
         

          <div className=" ">
            <EventDetail event={eventDetail} />

            {!pathname.includes("preview") && (
              <Link
                href={`/live-events/organization/${eventDetail?.organisationId}`}
                className="flex mt-10 sm:mt-20 hover:underline items-center gap-x-2 text-basePrimary text-sm"
              >
                <span>See All Events</span>
              </Link>
            )}
          </div>

          {!pathname.includes("preview") && <Footer />}
 */
