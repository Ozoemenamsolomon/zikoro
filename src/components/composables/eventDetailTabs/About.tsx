"use client"

import { ScrollableCards } from "@/components";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { FeedBackCard } from "../../published";
import { cn } from "@/lib";
import { Event } from "@/types";

export function About({
  className,
  event,
  isEventDetailPage,
}: {
  event: Event | null;
  className?: string;
  isEventDetailPage?: boolean;
}) {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    fade: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="w-full  hidden flex-col sm:flex gap-y-6 sm:gap-y-20">
      <div
        className={cn(
          "w-full px-4 sm:px-6 gap-6 grid grid-cols-1  items-center",
          className
        )}
      >
        <div className="w-full flex flex-col border gap-y-6 rounded-lg p-3 sm:p-4">
          <ul className="list-disc w-full flex flex-col items-start justify-start space-y-4">
            <h2 className="font-medium text-base sm:text-lg ">About Event</h2>
            <li className="flex flex-wrap leading-6 items-start justify-start">
              In this workshop, the anatomical basics of modeling are taught on
              the basis of the eye, nose and ear. The right choice of modelling
              clay will be another component. Important tools and corresponding
              techniques are discussed.
            </li>
            <li className="flex flex-wrap leading-6 items-start justify-start">
              At the end of the seminar, a certificate of participation will be
              handed over.
            </li>
          </ul>
          <ul className="list-disc w-full flex flex-col items-start justify-start space-y-4">
            <h2 className="font-medium text-base sm:text-lg ">Description</h2>
            <li className="flex flex-wrap leading-6 items-start justify-start">
              Attended the School of Fine Arts and Design in Berlin.
            </li>

            <li className="flex flex-wrap leading-6 items-start justify-start">
              Founded his own miniature label "Savage Feget Minis.
            </li>
            <li className="flex flex-wrap leading-6 items-start justify-start">
              {" "}
              In 2012 - has since worked for leading companies in the gaming
              industry.
            </li>
          </ul>
          <ul className="list-disc w-full flex flex-col items-start justify-start space-y-4">
            <h2 className="font-medium text-base sm:text-lg ">Benefits</h2>
            <li className="flex flex-wrap leading-6 items-start justify-start">
              Gain an understanding of the different types of resin, their
              properties, mixing techniques, and the tools needed for successful
              resin crafting.
            </li>
            <li className="flex flex-wrap leading-6 items-start justify-start">
              Experiment with various pigments, powders, and glitters to add
              dazzling colours and textures to your resin creations.
            </li>
            <li className="flex flex-wrap leading-6 items-start justify-start">
              Master the art of pouring and curing resin to achieve
              professional-looking jewellery pieces.
            </li>
            <li className="flex flex-wrap leading-6 items-start justify-start">
              Practise the techniques for achieving various jewellery effects
              and patterns.
            </li>
            <li className="flex flex-wrap leading-6 items-start justify-start">
              Practise the techniques for achieving various jewellery effects
              and patterns.
            </li>
            <li className="flex flex-wrap leading-6 items-start justify-start">
              Practise the techniques for achieving various jewellery effects
              and patterns.
            </li>
          </ul>
          <div className="flex flex-wrap leading-6 items-start justify-start">
            We reserve the right to cancel classes if the minimum number of
            participants is unmet. In such case, we would offer to reschedule
            the workshop or make complete refund.Cancelation Policy: The last
            day to make a complete refund request for a workshop is 14 days
            before the start of the class. Tickets can be used as credit for
            another comparable available workshop.
          </div>

          <div className="w-full h-full flex flex-col gap-y-6">
           

           {event?.eventAddress && <ul className="w-full flex flex-col items-start justify-start space-y-4">
              <h2 className="font-medium text-base sm:text-lg ">
                Event Address
              </h2>
              <li className="flex flex-wrap leading-6 items-start justify-start">
                {event?.eventAddress}
              </li>
            </ul>}
          </div>
        </div>

      
      </div>

      {isEventDetailPage && (
        <div className="w-full flex flex-col items-center py-10 sm:py-20 justify-center gap-y-6 sm:gap-y-8 bg-gray-50">
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
