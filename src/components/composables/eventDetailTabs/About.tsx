"use client";

import { ScrollableCards } from "@/components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { cn } from "@/lib";
import { geocodeAddress, isEventLive } from "@/utils";
import { Event } from "@/types";
import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useGetEventReviews } from "@/hooks";
import Link from "next/link";
import { ExternalLink } from "styled-icons/remix-fill";
import { InlineIcon } from "@iconify/react";

export function About({
  className,
  event,
  isEventDetailPage,
  isEventHome,
}: {
  event: Event | null;
  className?: string;
  isEventDetailPage?: boolean;
  isEventHome?: boolean;
}) {
  const pathname = usePathname();

  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    fade: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const showPreview = useMemo(() => {
    if (event && event?.eventWebsiteSettings) {
      return event?.eventWebsiteSettings[
        event?.eventWebsiteSettings?.length - 1
      ]?.status;
    } else {
      return true;
    }
  }, [event]);

  // conditonally adding comma to separate city and location
  const removeComma = useMemo(() => {
    return event?.eventCity === null || event?.eventCountry === null;
  }, [event?.eventCity, event?.eventCountry]);

  return (
    <div
      className={cn(
        "w-full bg-white hidden flex-col sm:flex gap-y-6 sm:gap-y-20 px-3",
        isEventDetailPage && "flex py-3 "
      )}
    >
      <div className="w-full h-full rounded-lg border px-2">
        <h3 className="pb-2 invisible w-full text-center">About this Event</h3>
        <div
          className={cn(
            "w-full  gap-6 py-3 grid grid-cols-1  items-center",
            className
          )}
        >
          {event?.description && (
            <div className="w-full px-4 sm:px-6 mb-2">
              <div
                className="innerhtml"
                dangerouslySetInnerHTML={{
                  __html: event?.description,
                }}
              />
            </div>
          )}
          <div
            className={cn(
              "w-full flex flex-col gap-y-6",
              isEventHome && "",
              isEventDetailPage && "hidden"
            )}
          >
            <div className="w-full h-full flex flex-col gap-y-6">
              {event?.eventAddress && (
                <ul className="w-full flex flex-col items-start justify-start space-y-4">
                  <li className="font-medium px-4 flex-col sm:px-6 flex items-start gap-2 text-base sm:text-lg ">
                    <p>Event Address</p>
                    {event?.locationType?.toLowerCase() !== "virtual" ? (
                      <p className=" flex items-center">
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
                    ) : (
                      <p>Virtual</p>
                    )}
                  </li>
                  <li className="flex flex-wrap px-4 sm:px-6 leading-6 items-start justify-start">
                    {event?.locationType?.toLowerCase() !== "virtual" ? (
                      <p className="text-xs sm:text-mobile">
                        {`${event?.eventCity ?? ""}`}
                        {!removeComma && <span>,</span>}
                        {` ${event?.eventCountry ?? ""}`}
                      </p>
                    ) : (
                      <p className="text-xs sm:text-mobile">
                        Meeting link will be shared with registered attendees
                      </p>
                    )}
                  </li>
                  <li className="w-full">
                    {event?.locationType?.toLowerCase() !== "virtual" ? (
                      <iframe
                        style={{ border: "none", borderRadius: "12px" }}
                        width="100%"
                        height="150"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(
                          event?.eventAddress
                        )}&z=15&ie=UTF8&iwloc=B&width=100%25&height=150&hl=en&output=embed`}
                      ></iframe>
                    ) : (
                      <div></div>
                    )}
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* 
      {isEventDetailPage &&
        !pathname.includes("preview") &&
        Array.isArray(reviews) &&
        reviews?.length > 0 && (
          <div
            className={cn(
              "w-full flex flex-col items-center py-10 sm:py-20 justify-center gap-y-6 sm:gap-y-8 bg-gray-50",
              event?.eventWebsiteSettings !== null && !showPreview && "hidden"
            )}
          >
            <h2 className="font-semibold text-base sm:text-2xl ">
              What past event attendees are saying...
            </h2>

            <div className="mx-auto hidden w-[95%]  sm:block">
              <ScrollableCards>
                {reviews.map((review, index) => (
                  <FeedBackCard review={review} key={index} />
                ))}
              </ScrollableCards>
            </div>
            <div className="block w-full sm:hidden">
              <Comp
                className=" z-[4] hidden h-full w-full sm:block "
                {...settings}
              >
                {reviews.map((review, index) => (
                  <FeedBackCard review={review} key={index} />
                ))}
              </Comp>
            </div>
          </div>
        )} */}
    </div>
  );
}

// https://www.google.com/maps/@6.508685,3.223821,15z?hl=en-US&entry=ttu
