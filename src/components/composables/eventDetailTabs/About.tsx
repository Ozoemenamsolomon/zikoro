"use client";

import { ScrollableCards } from "@/components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { FeedBackCard } from "../../published";
import { cn } from "@/lib";
import { geocodeAddress, isEventLive } from "@/utils";
import { Event } from "@/types";
import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useGetEventReviews } from "@/hooks";
import Link from "next/link";
import { ExternalLink } from "styled-icons/remix-fill";

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
  const { reviews } = useGetEventReviews(event?.eventAlias);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
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

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!event) return;
      try {
        const { lat, lng } = await geocodeAddress(event?.eventAddress);
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

 // console.log("hhh", coordinates);

  const Comp = Array.isArray(reviews) && reviews?.length > 1 ? Slider : "div";
  return (
    <div
      className={cn(
        "w-full  hidden flex-col sm:flex gap-y-6 sm:gap-y-20",
        isEventDetailPage && "flex"
      )}
    >
      <div
        className={cn(
          "w-full px-4 sm:px-6 gap-6 grid grid-cols-1  items-center",
          className
        )}
      >
        {event?.description && (
          <div className="w-full p-3 sm:p-4 mb-2">
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
            "w-full flex flex-col gap-y-6 p-3 sm:p-4",
            isEventHome && "rounded-lg border"
          )}
        >
          <div className="w-full h-full flex flex-col gap-y-6">
            {event?.eventAddress && (
              <ul className="w-full flex flex-col items-start justify-start space-y-4">
                <li className="font-medium flex items-center gap-x-2 text-base sm:text-lg ">
                  <p>Event Address</p>
                  {coordinates && (
                    <Link
                      target="_blank"
                      href={`https://www.google.com/maps/@${coordinates?.lat},${coordinates?.lng},15z?hl=en-US&entry=ttu`}
                      title="View Direction"
                    >
                      <ExternalLink size={20} className="text-basePrimary" />
                    </Link>
                  )}
                </li>
                <li className="flex flex-wrap leading-6 items-start justify-start">
                  {event?.eventAddress}
                </li>
                <li className="w-full">
                  {isLoaded && coordinates !== null ? (
                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "350px" }}
                      center={coordinates}
                      zoom={15}
                    >
                      <Marker position={coordinates} />
                    </GoogleMap>
                  ) : (
                    <div>Loading...</div>
                  )}
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

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
        )}
    </div>
  );
}

// https://www.google.com/maps/@6.508685,3.223821,15z?hl=en-US&entry=ttu
