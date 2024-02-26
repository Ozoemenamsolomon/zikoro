"use client";

import { useFetchSingleEvent } from "@/hooks";
import { EventSchedule } from "./_components";
import { SideBarLayout } from "..";
import { EventDetailTabs } from "../composables";
import { useState } from "react";
import { cn } from "@/lib";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";

export function SingleEventHome({ eventId }: { eventId: string }) {
  const { data } = useFetchSingleEvent(eventId);
  const [active, setActive] = useState(1);

  function setActiveTab(active: number) {
    setActive(active);
  }

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
    <SideBarLayout
      hasTopBar
      className="px-0 sm:px-0 pt-0 sm:pt-0"
      parentClassName="px-0 sm:px-0 py-0 sm:py-0 pt-3 sm:pt-4"
      eventId={eventId}
      eventName={data?.eventTitle}
    >
      <div className="w-full grid grid-cols-1 md:grid-cols-7 items-start pt-14 ">
        <div className="w-full md:col-span-4 flex flex-col gap-y-4  items-start justify-start border-r">
          <div className={cn("w-full", active > 1 && "hidden sm:block")}>
            <EventSchedule event={data} />
          </div>
          <EventDetailTabs
            active={active}
            setActiveTab={setActiveTab}
            event={data}
            aboutClassName={"lg:grid-cols-1"}
          />
        </div>
      </div>
      <div className="w-full block sm:hidden">
      <Slider className="z-[4] block w-full" {...settings}>
        {[1, 2, 3, 4].map((_) => (
          <div className="w-full h-36 bg-zikoro relative ">
            <Image
              className="w-fit h-fit flex items-center inset-0 justify-center m-auto absolute"
              src="/images/zik.png"
              alt="logo"
              width={300}
              height={200}
            />
          </div>
        ))}
      </Slider>

      </div>
    </SideBarLayout>
  );
}
