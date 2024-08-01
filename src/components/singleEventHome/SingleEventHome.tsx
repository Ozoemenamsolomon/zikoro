"use client";

import {
  useFetchSingleEvent,
  useFetchPartners,
  useVerifyUserAccess,
  useCheckTeamMember,
  useGetUserPoint,
  useFetchPartnersOffers,
} from "@/hooks";
import { EventSchedule } from "./_components";
import { EventDetailTabs } from "../composables";
import { useState } from "react";
import { cn } from "@/lib";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
import { Reward, RedeemPoint } from "@/types";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { RewardCard } from "../marketPlace/rewards/_components";
import { useGetData } from "@/hooks/services/request";
import { Offers } from "../partners/_components";
export function SingleEventHome({ eventId }: { eventId: string }) {
  const { data, loading } = useFetchSingleEvent(eventId);
  const [active, setActive] = useState(1);
  const {
    data: rewards,
    isLoading: loadingRewards,
    getData: refetch,
  } = useGetData<Reward[]>(`/rewards/${eventId}`);
  const { totalPoints } = useGetUserPoint(eventId);
  const { attendee, isOrganizer } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const {
    offers,
    loading: isLoading,
    refetch: refetchOffer,
  } = useFetchPartnersOffers(eventId);

  const { data: partnersData, loading: partnersLoading } =
    useFetchPartners(eventId);

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

  const Comp =
    Array.isArray(partnersData) && partnersData?.length > 1 ? Slider : "div";
  return (
    <>
      <div className="w-full grid grid-cols-1 md:grid-cols-9 items-center justify-center sm:justify-start sm:items-start ">
        <div className="w-full col-span-full md:col-span-6 flex flex-col gap-y-4  items-start justify-start border-r">
          <div className={cn("w-full", active > 1 && "hidden sm:block")}>
            <EventSchedule event={data} loading={loading} />
          </div>
          {Array.isArray(partnersData) && partnersData?.length > 0 && (
            <div
              className={cn(
                "w-full grid grid-cols-8 sm:hidden items-center gap-2 justify-center",
                active > 1 && "hidden"
              )}
            >
              <div className="w-full h-[89px] col-span-3 font-semibold flex items-center justify-center">
                Sponsors
              </div>
              <div className="w-full col-span-5 block sm:hidden">
                <Comp
                  className="banner z-[4] h-[89px] block w-full"
                  {...settings}
                >
                  {partnersData.map(({ companyLogo }) => (
                    <div className="w-full h-[80px] relative ">
                      {companyLogo ? (
                        <Image
                          className="w-[100px] h-[40px] object-contain flex items-center inset-0 justify-center m-auto absolute"
                          src={companyLogo}
                          alt="logo"
                          width={300}
                          height={200}
                        />
                      ) : (
                        <div className="w-[100px] h-[40px] animate-pulse bg-gray-200"></div>
                      )}
                    </div>
                  ))}
                </Comp>
              </div>
            </div>
          )}
          <EventDetailTabs
            active={active}
            setActiveTab={setActiveTab}
            event={data}
            isEventHome
            aboutClassName={" lg:grid-cols-1"}
          />
        </div>
        <div className="hidden md:block md:col-span-3 w-full p-4 md:overflow-y-auto">
          <h2 className="font-semibold text-base sm:text-xl mb-2">Offers</h2>

          <Offers
            data={offers}
            attendee={attendee}
            eventId={eventId}
            refetch={refetchOffer}
            isOrganizer={isOrganizer || isIdPresent}
          />
        </div>
      </div>
    </>
  );
}
