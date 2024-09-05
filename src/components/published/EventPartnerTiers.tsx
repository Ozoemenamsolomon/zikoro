"use client";

import { ArrowBack } from "styled-icons/boxicons-regular";
import { Button } from "@/components";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useFetchSingleEvent } from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { useMemo, useState } from "react";
import { partnerDetails } from "@/schemas";
import { formatDate } from "@/utils";
import { AddPartners } from "../partners/_components";

type TEventData = {
  image: string;
  eventTitle: string;
  organizerLogo: string;
  startDate: string;
  endDate: string;
};

type TSIngleTier = {
  validity: string;
  partnerType: string;
  tierName: string;
  quantity: string;
  price: string;
  currency: string;
  color: string;
  description?: string;
};

function TierDescription({
  close,
  description,
  tier
}: {
  description: string;
  close: () => void;
  tier: TSIngleTier;
}) {
  return (
    <div className="w-full p-4 bg-[#F9FAFF] fixed inset-0 z-[100] overflow-y-auto">
      <Button className="px-0 w-fit h-fit">
        <ArrowBack size={24} onClick={close} />
      </Button>

      <div className="max-w-3xl mx-auto relative box-animation bg-white w-full h-fit pt-8  px-4 sm:px-6 sm:pt-10 pb-4 sm:pb-6">
      <div
            style={{ backgroundColor: tier?.color || "#001ffc" }}
            className="w-fit min-w-[200px] font-medium absolute mx-auto  text-white inset-x-0 -top-7 flex items-center justify-center h-14 rounded-lg"
          >
            <p className="text-white capitalize font-medium w-fit text-tiny sm:text-xs bg-basePrimary rounded-3xl px-2 py-1 absolute inset-x-0 mx-auto -top-3">
              {tier?.partnerType}
            </p>
            <p className="capitalize text-ellipsis whitespace-nowrap overflow-hidden w-full text-center">
              {tier?.tierName}
            </p>
          </div>
        <p
          className="w-full partner-innerhtml  mb-3"
          dangerouslySetInnerHTML={{
            __html: description ?? "",
          }}
        />
      </div>
    </div>
  );
}
function PartnerTierCard({
  tier,
  eventId,
}: {
  eventId: string;
  tier: TSIngleTier;
}) {
  const [isOpen, setOpen] = useState(false);
  const [isDescription, setIsDescription] = useState(false);
  const date = useMemo(() => {
    return formatDate(tier?.validity);
  }, [tier?.validity]);

  function onToggle() {
    setOpen((prev) => !prev);
  }
  function toggleDescription() {
    setIsDescription((prev) => !prev);
  }
  return (
    <>
      <div className="w-full mt-10">
        <div className="w-full bg-white rounded-lg relative pt-16 pb-6 border px-4">
          <div
            style={{ backgroundColor: tier?.color || "#001ffc" }}
            className="w-[85%] font-medium absolute mx-auto  text-white inset-x-0 -top-7 flex items-center justify-center h-14 rounded-lg"
          >
            <p className="text-white capitalize font-medium w-fit text-tiny sm:text-xs bg-basePrimary rounded-3xl px-2 py-1 absolute inset-x-0 mx-auto -top-3">
              {tier?.partnerType}
            </p>
            <p className="capitalize text-ellipsis whitespace-nowrap overflow-hidden w-full text-center">
              {tier?.tierName}
            </p>
          </div>
          <div className="w-full flex flex-col items-center gap-y-2">
            <h2 className="font-semibold text-lg sm:text-xl mb-3">{`${
              tier?.currency
            } ${Number(tier?.price ?? 0).toLocaleString()}`}</h2>

            {tier?.description && (
              <>
                <p
                  className="w-full partner-innerhtml line-clamp-3 text-gray-500 text-sm mb-3"
                  dangerouslySetInnerHTML={{
                    __html: tier?.description ?? "",
                  }}
                />

                <button
                  onClick={toggleDescription}
                  className="text-gray-500 underline text-xs sm:text-mobile"
                >
                  View More
                </button>
              </>
            )}

            <Button
              onClick={onToggle}
              className="w-fit bg-basePrimary px-6 text-white rounded-lg h-11"
            >
              Select
            </Button>
            <p className="text-xs sm:text-mobile">
              Available until <span className="font-medium">{date}</span>
            </p>
          </div>
        </div>
      </div>
      {isOpen && (
        <AddPartners close={onToggle} eventId={eventId} partnerTier={tier} />
      )}
      {isDescription && tier?.description && (
        <TierDescription
          close={toggleDescription}
          description={tier?.description}
          tier={tier}
        />
      )}
    </>
  );
}
export default function EventPartnerTiers({ eventId }: { eventId: string }) {
  const params = useSearchParams();
  const eventDataString = params.get("e");
  const { data, loading } = useFetchSingleEvent(eventId);

  const router = useRouter();

  const eventData: TEventData | null = useMemo(() => {
    if (eventDataString) {
      const decodedEventData = decodeURIComponent(eventDataString);
      return JSON.parse(decodedEventData);
    } else {
      return null;
    }
  }, [eventDataString]);

  const restructureData = useMemo(() => {
    if (data) {
      const newData = {
        sponsor: data?.partnerDetails?.filter(
          (v) => v?.partnerType === "sponsor"
        ),
        exhibitor: data?.partnerDetails?.filter(
          (v) => v?.partnerType === "exhibitor"
        ),
      };

      return newData;
    }
  }, [data]);

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
        {loading ? (
          <div className="w-full h-[20rem] flex items-center justify-center">
            <LoaderAlt size={30} className="animate-spin" />
          </div>
        ) : (
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
                Select a partnership plan and partner with the organizer for
                this event
              </p>
              <p className="font-semibold">{eventData?.eventTitle ?? ""}</p>
              <p className="">
                {eventData?.startDate ?? ""} - {eventData?.endDate ?? ""}
              </p>
            </div>

            <div className="w-full mt-4 sm:mt-8">
              {restructureData &&
                Object.entries(restructureData).map(([partnerType, data]) => (
                  <div key={Math.random()} className="w-full">
                   {data?.length > 0 && <p className="font-semibold capitalize text-zinc-700 my-8">
                      {partnerType} Tiers
                    </p>}
                    <div
                      key={Math.random()}
                      className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
                    >
                      {Array.isArray(data) &&
                        data?.map((tier) => (
                          <PartnerTierCard
                            key={Math.random()}
                            tier={tier}
                            eventId={eventId}
                          />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
