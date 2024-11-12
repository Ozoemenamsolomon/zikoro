"use client";

import {
  useFetchSingleEvent,
  useFetchPartners,
  useVerifyUserAccess,
  useCheckTeamMember,
  useGetUserPoint,
  useFetchPartnersOffers,
  useGetEventAttendees,
  useGetEventReviews,
} from "@/hooks";

import { SpeakerWidget } from "../composables";
import { useMemo, useState } from "react";
import { cn } from "@/lib";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { Event, RedeemPoint, Reward, TOrgEvent } from "@/types";
import { useGetData } from "@/hooks/services/request";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { InlineIcon } from "@iconify/react";
import { ScrollWrapper } from "./_components/ScrollWrapper";
import { PartnerCard } from "../partners/sponsors/_components";
import { EngagementsSettings, TLead, TLeadsInterest } from "@/types";
import { OfferCard } from "../partners/_components/offers/OfferCard";
import { RewardCard } from "../marketPlace/rewards/_components";
import { FeedBackCard } from "../published";
import { useRouter } from "next/navigation";
import { ReceptionAgenda } from "./_components/ReceptionAgenda";
import { EventDetailMobileTab } from "../composables/eventDetailTabs/EventDetailMobileTab";
import { AboutEvent } from "../published/SinglePublishedEvent";

export function SingleEventHome({ eventId }: { eventId: string }) {
  const { data, loading, refetch: refetchEvent } = useFetchSingleEvent(eventId);
  const router = useRouter();
  // const [active, setActive] = useState(1);
  const {
    data: rewards,
    isLoading: loadingRewards,
    getData: refetch,
  } = useGetData<Reward[]>(`/rewards/${eventId}`);
  const { attendees, isLoading: loadingAttendees } =
    useGetEventAttendees(eventId);
  const [active, setActive] = useState<"sponsors" | "exhibitors">("sponsors");
  const [isOpen, setIsOpen] = useState(false);
  const { totalPoints } = useGetUserPoint(eventId);
  const { attendee, isOrganizer, attendeeId } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const {
    offers,
    loading: isLoading,
    refetch: refetchOffer,
  } = useFetchPartnersOffers(eventId);
  const { data: engagementsSettings } = useGetData<EngagementsSettings>(
    `engagements/${eventId}/settings`
  );
  const { data: redeemedRewards, getData } = useGetData<RedeemPoint[]>(
    `/rewards/${eventId}/redeemed`
  );
  const { data: leadsInterests } = useGetData<TLeadsInterest[]>(
    `leads/interests/${eventId}`
  );
  const { data: leads } = useGetData<TLead[]>(`leads/event/${eventId}`);

  const { data: partnersData, loading: partnersLoading } =
    useFetchPartners(eventId);

  const { reviews, isLoading: loadingReview } = useGetEventReviews(eventId);

  // function setActiveTab(active: number) {
  //   setActive(active);
  // }

  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   autoplay: true,
  //   fade: false,
  //   speed: 400,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  // };

  const formattedAttendees = useMemo(() => {
    return attendees?.filter(({ attendeeType, speakingAt, archive }) => {
      return (
        (!archive && attendeeType?.includes("speaker")) ||
        (Array.isArray(speakingAt) && speakingAt?.length > 0 && !archive)
      );
    });
  }, [attendees]);

  // const nonArchiveAttendees = useMemo(() => {
  //   return attendees?.filter((attendee) => !attendee?.archive);
  // }, [attendees]);

  const approvedPartners = useMemo(() => {
    return (
      partnersData?.filter(({ partnerStatus }) => partnerStatus === "active") ||
      []
    );
  }, [data]);

  const restructureData = useMemo(() => {
    if (data) {
      const newData = {
        sponsors: approvedPartners?.filter((v) => v?.partnerType === "sponsor"),
        exhibitors: approvedPartners?.filter(
          (v) => v?.partnerType === "exhibitor"
        ),
      };

      return newData;
    }
  }, [approvedPartners]);

  function onClose() {
    setIsOpen((p) => !p);
  }

  // const Comp =
  //   Array.isArray(partnersData) && partnersData?.length > 1 ? Slider : "div";

  if (loading || !data)
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <LoaderAlt size={30} className="animate-spin" />
      </div>
    );
  return (
    <>
      <div className="w-full px-4 mx-auto  max-w-[1300px] text-mobile sm:text-sm sm:px-6 mt-6 sm:mt-10 ">
        <div className="w-full flex mb-6 sm:mb-10 items-center gap-x-3">
          {data?.eventPoster ? (
            <Image
              src={data?.eventPoster}
              className="w-24 h-24 rounded-lg object-cover sm:w-48  sm:h-48"
              alt={data?.eventTitle}
              width={300}
              height={300}
            />
          ) : (
            <div className=" w-24 h-24 rounded-lg sm:w-36  sm:h-36  animate-pulse">
              <div className="w-full h-full bg-gray-200"></div>
            </div>
          )}
          <div className="flex flex-col gap-y-2 items-start justify-start">
            <div className="w-fit px-3 py-1 bg-gradient-to-tr border rounded-2xl border-[#001fcc] from-custom-bg-gradient-start to-custom-bg-gradient-end">
              <p className="gradient-text bg-basePrimary text-xs sm:text-sm">
                {data?.locationType ?? ""}
              </p>
            </div>
            <h2 className="font-semibold text-lg sm:text-2xl">
              {data?.eventTitle ?? ""}
            </h2>
            <button onClick={onClose} className="flex items-center gap-x-1">
              <InlineIcon icon="line-md:alert-circle-twotone" fontSize={18} />
              <span className="text-xs sm:text-mobile">About Event</span>
            </button>
          </div>
        </div>
        <div className="w-full block sm:hidden mb-6">
          <h2 className="font-semibold text-desktop sm:text-lg mb-3">
            Partners
          </h2>
          <div className="w-full overflow-x-auto no-scrollbar">
            <div className="min-w-max flex items-center gap-x-2">
              {partnersData.map(({ companyLogo }) => (
                <div className="w-[100px] h-[40px] bg-white px-3 py-2 rounded-md relative ">
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
            </div>
          </div>
        </div>
        <ReceptionAgenda
          event={data}
          eventId={eventId}
          isIdPresent={isIdPresent}
          isOrganizer={isOrganizer}
          attendeeId={attendeeId}
          refetchEvent={refetchEvent}
        />
        {!loadingAttendees && Array.isArray(formattedAttendees) && (
          <ScrollWrapper
            header="Speakers"
            onclick={() => {}}
            hideSeeAll
            children={
              <>
                {formattedAttendees.map((attendee) => (
                  <SpeakerWidget
                    key={attendee?.id}
                    attendee={attendee}
                    className="border rounded-lg w-[250px] h-[250px] sm:w-[250px]"
                  />
                ))}
              </>
            }
          />
        )}

        <div className="w-full hidden h-full my-10 sm:grid sm:grid-cols-1 md:grid-cols-2 gap-6">
          {!partnersLoading && (
            <ScrollWrapper
              header="Partners"
              onclick={() =>
                router.push(`/event/${eventId}/partners?p=${active}`)
              }
              parentClassName="px-6 pt-36  h-full rounded-lg pb-10 bg-white"
              children={
                <>
                  <div className="flex absolute w-fit mx-auto inset-x-0 top-10 items-center bg-[#F9FAFF]  justify-center rounded-xl p-1 border">
                    {["sponsors", "exhibitors"].map((v: any) => (
                      <button
                        onClick={() => setActive(v)}
                        className={cn(
                          " rounded-xl capitalize px-3 py-2",
                          active === v && "bg-white border"
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  {restructureData &&
                    Array.isArray(restructureData[active]) &&
                    restructureData[active].map((sponsor) => (
                      <PartnerCard
                        key={sponsor.id}
                        event={data}
                        isEventDetail
                        sponsor={sponsor}
                      />
                    ))}
                </>
              }
            />
          )}
          {!isLoading && Array.isArray(offers) && (
            <ScrollWrapper
              header="Offers"
              onclick={() =>
                router.push(`/event/${eventId}/market-place/offers`)
              }
              children={
                <>
                  {offers.map((offer) => (
                    <OfferCard
                      key={offer.partnerId}
                      offer={offer}
                      attendee={attendee}
                      isOrganizer={isOrganizer}
                      engagementsSettings={engagementsSettings}
                      leadsInterests={leadsInterests}
                      leads={leads}
                      refetch={refetchOffer}
                      className="w-[300px] h-[310px]"
                    />
                  ))}
                </>
              }
            />
          )}
        </div>

        {!loadingRewards && Array.isArray(rewards) && (
          <ScrollWrapper
            header="Offers"
            onclick={() =>
              router.push(`/event/${eventId}/market-place/rewards`)
            }
            children={
              <>
                {rewards.map((reward, index) => (
                  <RewardCard
                    key={index}
                    refetch={refetch}
                    refetchRedeemed={getData}
                    redeemedRewards={redeemedRewards}
                    attendeeId={attendeeId}
                    attendeePoints={totalPoints}
                    isOrganizer={isOrganizer || isIdPresent}
                    reward={reward}
                    className="w-[300px] h-[310px]"
                  />
                ))}
              </>
            }
          />
        )}

        <div className="w-full mt-10">
          {!loadingReview && Array.isArray(reviews) && (
            <ScrollWrapper
              header="Reviews"
              onclick={() => {}}
              hideSeeAll
              children={
                <>
                  {reviews.map((review, index) => (
                    <FeedBackCard
                      key={index}
                      review={review}
                      className="w-[250px] h-[250px]"
                    />
                  ))}
                </>
              }
            />
          )}
        </div>
        <div className="w-full sm:hidden block">
          <h2 className="font-semibold mb-4 text-desktop sm:text-lg">
            Quick Action
          </h2>
          <EventDetailMobileTab
            className="bg-white w-full px-4 py-6 rounded-lg"
            eventId={eventId}
            formattedAttendees={formattedAttendees}
          />
        </div>
      </div>
      {isOpen && <AboutModal close={onClose} event={data} />}
    </>
  );
}

function AboutModal({ close, event }: { event: Event; close: () => void }) {
  return (
    <div
    role="button"
    onClick={close}
    className="fixed inset-0 w-full h-full z-[100] ">
      <div
      onClick={(e) => e.stopPropagation()}
      className="py-6 px-5 max-w-2xl rounded-lg bg-white absolute inset-0 m-auto max-h-[85%]">
        <div className="w-full pb-2 mb-6 border-b flex items-center justify-between">
          <h2 className="text-lg sm:text-2xl font-semibold">About Event</h2>

          <button onClick={close}>
            <InlineIcon icon="line-md:close-circle-filled" fontSize={24} />
          </button>
        </div>
        <div className="w-full flex flex-col items-start gap-y-2 justify-start">
          <h2 className="font-semibold text-lg sm:text-2xl ">
            {event?.eventTitle ?? ""}
          </h2>
          {event && <AboutEvent event={event as TOrgEvent} />}
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
        </div>
        <div className="w-full flex flex-col justify-start items-start mt-6 sm:mt-8">
          <h2 className="font-semibold mb-4 sm:mb-6 text-lg sm:text-2xl ">
            Event Description
          </h2>
          <div dangerouslySetInnerHTML={{ __html: event?.description ?? "" }} />
        </div>
      </div>
    </div>
  );
}

/**
  <div className="w-full bg-white col-span-full md:col-span-6 flex flex-col gap-y-4  items-start justify-start border-r">
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
        <div className="hidden md:block md:col-span-3 w-full px-4 py-4 md:overflow-y-auto">
          <h2 className="font-semibold text-base sm:text-xl mb-2">Offers</h2>

          <Offers
            data={offers}
            attendee={attendee}
            eventId={eventId}
            refetch={refetchOffer}
            isOrganizer={isOrganizer || isIdPresent}
          />
        </div>
 */
