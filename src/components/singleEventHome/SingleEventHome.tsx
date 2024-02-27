"use client";

import { useFetchSingleEvent, useFetchPartners } from "@/hooks";
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
  const { data: partnersData } = useFetchPartners(eventId);

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
          {Array.isArray(partnersData) && partnersData?.length > 0 && (
            <div className="w-full grid grid-cols-8 items-center gap-2 justify-center">
              <div className="w-full h-[89px] col-span-3 font-semibold flex items-center justify-center">
                Sponsors
              </div>
              <div className="w-full col-span-5 block sm:hidden">
                <Slider
                  className="banner z-[4] h-[89px] block w-full"
                  {...settings}
                >
                  {partnersData.map(({ companyLogo }) => (
                    <div className="w-full h-[80px] relative ">
                      <Image
                        className="w-[100px] h-[40px] object-contain flex items-center inset-0 justify-center m-auto absolute"
                        src={companyLogo}
                        alt="logo"
                        width={300}
                        height={200}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          )}
          <EventDetailTabs
            active={active}
            setActiveTab={setActiveTab}
            event={data}
            aboutClassName={"lg:grid-cols-1"}
          />
        </div>
      </div>
    </SideBarLayout>
  );
}
