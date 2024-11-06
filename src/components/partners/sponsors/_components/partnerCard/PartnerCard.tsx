"use client";

import Image from "next/image";
import Link from "next/link";
import { TPartner, Event } from "@/types";
import { useMemo } from "react";
import { Location } from "styled-icons/fluentui-system-regular";
import useUserStore from "@/store/globalUserStore";
import {
  IconifyPartnerIndustryIcon,
  IconifyPartnerLocationIcon,
} from "@/constants";

export function PartnerCard({
  sponsor,
  event,
  isEventDetail,
}: {
  event: Event;
  sponsor: TPartner;
  isEventDetail?: boolean;
}) {
  const image = useMemo(() => {
    const regex = /^[https://]/;
    if (regex.test(sponsor.companyLogo)) {
      return sponsor.companyLogo;
    } else {
      return "/images/zikoro.png";
    }
  }, [sponsor.companyLogo]);

  const { user } = useUserStore();

  const tierColor = useMemo(() => {
    return event?.partnerDetails?.find(
      (v) => v?.tierName === sponsor?.tierName
    );
  }, [event, sponsor]);

  const rgba = useMemo(
    (alpha = 0.1) => {
      if (tierColor?.color) {
        const r = parseInt(tierColor?.color.slice(1, 3), 16);
        const g = parseInt(tierColor?.color.slice(3, 5), 16);
        const b = parseInt(tierColor?.color.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    },
    [tierColor?.color]
  );
  return (
    <Link
      href={
        isEventDetail
          ? ""
          : `/event/${event?.eventAlias}/partner/${sponsor.partnerAlias}`
      }
      className=" border shadow  h-full border-gray-100 pb-4 relative rounded-lg overflow-hidden bg-white flex flex-col gap-y-2 items-start justify-start"
    >
      <div className="flex items-center  justify-between w-full p-4">
        {image ? (
          <Image
            src={image}
            alt="sponsor-logo"
            width={300}
            height={100}
            className=" max-w-[100px] max-h-[40px] object-contain"
          />
        ) : (
          <div className="w-[100px] h-[40px] animate-pulse bg-gray-200"></div>
        )}

        {sponsor?.tierName &&
          sponsor.partnerType.toLowerCase().includes("exhibitor") && (
            <p
              style={{
                color: tierColor?.color || "#001fcc",
                border: `1px solid ${tierColor?.color}`,
                backgroundColor: rgba,
              }}
              className=" px-4 py-1 text-sm rounded-3xl"
            >
              {sponsor?.tierName}
            </p>
          )}
      </div>
      <div className="w-full px-4   items-start col-span-2 text-[#717171] justify-start flex flex-col gap-y-4">
        <div className="font-semibold flex capitalize flex-wrap text-black text-xl">
          {sponsor.companyName ?? ""}
        </div>

        {/* <div className="flex flex-wrap  line-clamp text-sm w-full  items-start justify-start leading-6">
          {sponsor.description ?? ""}
        </div> */}

        {/**  */}
        {!isEventDetail && (
          <div className="flex items-center text-sm capitalize gap-x-2">
            {sponsor.exhibitionHall && (
              <p>{`${sponsor.exhibitionHall}${
                !!sponsor.exhibitionHall && ","
              }`}</p>
            )}
            {sponsor?.boothNumber
              ? ` Booth ${sponsor?.boothNumber?.toString()}`
              : ""}
          </div>
        )}
        <div className="flex flex-col items-start gap-2">
          {!sponsor?.city && !sponsor?.country ? null : (
            <div className="flex items-start gap-x-2">
              <IconifyPartnerLocationIcon />
              <p>{`${sponsor.city || "City"}, ${
                sponsor.country || "Country"
              }`}</p>
            </div>
          )}
          {sponsor.industry && (
            <div className="flex items-start gap-x-2">
              <IconifyPartnerIndustryIcon />
              <p>{sponsor.industry}</p>
            </div>
          )}
        </div>

        {!isEventDetail && (
          <div className="flex items-center gap-x-4">
            {sponsor?.jobs && (
              <button className="bg-[#20A0D8] bg-opacity-10 text-xs text-[#20A0D8] px-2 py-2 rounded-md">
                Hiring
              </button>
            )}
            {sponsor?.offers && (
              <button className="bg-[#F44444] bg-opacity-10 text-xs text-[#F44444] px-2 py-2 rounded-md">
                Promo
              </button>
            )}
            {sponsor.stampIt && (
              <button className=" flex items-center justify-center w-fit bg-[#20A0D8] bg-opacity-10 text-xs text-[#20A0D8] px-2 py-2 rounded-md">
                StampCard
              </button>
            )}
          </div>
        )}
      </div>
      {!isEventDetail &&
        Array.isArray(sponsor.boothStaff) &&
        sponsor.boothStaff.find(({ email }) => user?.userEmail === email) && (
          <Link
            className="text-sky-500 text-sm px-4 pt-2 font-medium hover:underline"
            href={`/event/${event?.eventAlias}/partner/${sponsor.partnerAlias}/leads`}
          >
            show Leads
          </Link>
        )}
    </Link>
  );
}
