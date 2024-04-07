"use client";

import { ScrollableCards } from "@/components";
import { useMemo } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { FeedBackCard } from "../../published";
import { cn } from "@/lib";
import { Event } from "@/types";
import { usePathname } from "next/navigation";

export function About({
  className,
  event,
  isEventDetailPage,
}: {
  event: Event | null;
  className?: string;
  isEventDetailPage?: boolean;
}) {
  const pathname = usePathname();
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
    return true
  }, [event]);
/**
  event?.eventWebsiteSettings[event?.eventWebsiteSettings?.length - 1]
      ?.status;
 */
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
        <div className="w-full flex flex-col border gap-y-6 rounded-lg p-3 sm:p-4">
          {event?.description && (
            <div
              className="innerhtml"
              dangerouslySetInnerHTML={{
                __html: event?.description,
              }}
            />
          )}
          <div className="w-full h-full flex flex-col gap-y-6">
            {event?.eventAddress && (
              <ul className="w-full flex flex-col items-start justify-start space-y-4">
                <h2 className="font-medium text-base sm:text-lg ">
                  Event Address
                </h2>
                <li className="flex flex-wrap leading-6 items-start justify-start">
                  {event?.eventAddress}
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {isEventDetailPage && !pathname.includes("preview") && (
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
              {[1, 2, 3, 4, 5].map((_) => (
                <FeedBackCard key={_} />
              ))}
            </ScrollableCards>
          </div>
          <div className="block w-full sm:hidden">
            <Slider
              className=" z-[4] hidden h-full w-full sm:block "
              {...settings}
            >
              {[1, 2, 3, 4, 5].map((_) => (
                <FeedBackCard key={_} />
              ))}
            </Slider>
          </div>
        </div>
      )}
    </div>
  );
}
