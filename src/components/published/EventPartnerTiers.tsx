"use client";

import { ArrowBack } from "styled-icons/boxicons-regular";
import { Button } from "@/components";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useMemo } from "react";

type TEventData = {
  image: string;
  eventTitle: string;
  organizerLogo: string;
  startDate: string;
  endDate: string;
};
function PartnerTierCard() {
  return (
    <div className="w-full mt-10">
      <div className="w-full bg-white rounded-lg relative pt-16 pb-6 border px-4">
        <div className="w-[85%] font-medium absolute mx-auto bg-pink-600 text-white inset-x-0 -top-7 flex items-center justify-center h-14 rounded-lg">
          <p className="text-white font-medium w-fit text-tiny sm:text-xs bg-basePrimary rounded-3xl px-2 py-1 absolute inset-x-0 mx-auto -top-3">
            Sponsor
          </p>
          <p>Partner Tier Name</p>
        </div>
        <div className="w-full flex flex-col items-center gap-y-2">
          <h2 className="font-semibold text-lg sm:text-xl mb-3">NGN 5,000</h2>

          <p className="w-full line-clamp-3 text-gray-500 text-sm mb-3">
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button className="text-gray-500 underline">View More</button>

          <Button className="w-fit bg-basePrimary px-6 text-white rounded-lg h-11">
            Select
          </Button>
          <p className="text-xs sm:text-mobile">
            Available until <span className="font-medium">06 July, 2024</span>
          </p>
        </div>
      </div>
    </div>
  );
}
export default function EventPartnerTiers({ eventId }: { eventId: string }) {
  const params = useSearchParams();
  const eventDataString = params.get("e");

  const router = useRouter();

  const eventData: TEventData | null = useMemo(() => {
    if (eventDataString) {
      const decodedEventData = decodeURIComponent(eventDataString);
      return JSON.parse(decodedEventData);
    } else {
      return null;
    }
  }, [eventDataString]);

  return (
    <div className="w-full bg-[#F9FAFF] h-full">
      <div className="w-full h-72 sm:h-[400px] lg:h-[500px] relative">
        {eventData?.image ? (
          <Image
            src={eventData?.image}
            alt="event-image"
            width={600}
            height={600}
            className="w-full h-72 sm:h-[400px] lg:h-[500px]  object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-t-2xl sm:rounded-tr-none sm:rounded-l-2xl  animate-pulse">
            <div className="w-full h-full bg-gray-200"></div>
          </div>
        )}
        <div className="absolute left-10 bottom-0 bg-white px-3 py-2 rounded-t-lg ">
          <Image
            src={eventData?.organizerLogo || "/logo.png"}
            alt="logo"
            width={300}
            height={300}
            className="w-fit h-fit max-h-[40px]"
          />
        </div>
      </div>
      <div className="w-full bg-[#F9FAFF]">
      <div className="mx-auto w-full  h-full p-4 max-w-[90%] my-4 sm:my-6">
        <div className="flex items-center gap-x-2">
          <Button
            onClick={() => router.back()}
            className="px-0 h-fit w-fit  bg-none  "
          >
            <ArrowBack className="px-0 w-fit h-fit" size={22} />
            
          </Button>
          <p className="text-mobile sm:text-sm">Go To Event HomePage</p>
        </div>

        <div className="w-fit my-6 sm:my-10 mx-auto flex flex-col items-center justify-center gap-y-2 ">
          <h2 className="text-basePrimary font-semibold text-lg sm:text-2xl">
            Become a Partner
          </h2>
          <p>
            Select a partnership plan and partner with the organizer for this
            event
          </p>
          <p className="font-semibold">{eventData?.eventTitle ?? ""}</p>
          <p className="">
            {eventData?.startDate ?? ""} - {eventData?.endDate ?? ""}
          </p>
        </div>

        <div className="w-full mt-4 sm:mt-8">
          <div className="w-full">
            <p className="font-semibold  text-zinc-700 mb-8">Sponsor Tiers</p>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(6)].map((_) => (
                <PartnerTierCard key={Math.random()} />
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
