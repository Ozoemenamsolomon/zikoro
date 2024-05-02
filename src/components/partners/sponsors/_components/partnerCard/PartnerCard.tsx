"use client";

import Image from "next/image";
import Link from "next/link";
import { TExPartner } from "@/types";
import { useMemo } from "react";

import { Location } from "@styled-icons/fluentui-system-regular/Location";

export function PartnerCard({ sponsor, eventId }: {eventId: string; sponsor: TExPartner }) {
  const image = useMemo(() => {
    const regex = /^[https://]/;
    if (regex.test(sponsor.companyLogo)) {
      return sponsor.companyLogo;
    } else {
      return "/images/zikoro.png";
    }
  }, [sponsor.companyLogo]);

  // console.log(sponsor.industry?.name);
  return (
    <Link
      href={`/event/${eventId}/partner/${sponsor.partnerAlias}`}
      className=" border  h-full border-gray-100 relative rounded-lg overflow-hidden bg-white flex flex-col gap-y-2 items-start justify-start"
    >
      {sponsor.stampIt && (
        <button className="absolute right-[-2px] top-0 flex items-center justify-center w-fit bg-[#20A0D8] bg-opacity-10 text-xs text-[#20A0D8] px-2 py-2 rounded-b-md">
          StampCard
        </button>
      )}
    {image ?  <Image
        src={image}
        alt="sponsor-logo"
        width={300}
        height={100}
        className="w-36 pl-4 pt-8 lg:w-[6rem] xl:w-32 h-[70px]"
      />  
    :
    <div  className="w-36 pl-4 pt-8 lg:w-[6rem] xl:w-32 h-[70px] animate-pulse bg-gray-200"></div>
    }
      <div className="w-full px-4 py-8  items-start col-span-2 text-[#717171] justify-start flex flex-col gap-y-4">
        <div className="font-semibold flex capitalize flex-wrap text-black text-xl">
          {sponsor.companyName ?? ""}
        </div>

        <div className="flex flex-wrap  line-clamp text-sm w-full  items-start justify-start leading-6">
          {sponsor.description ?? ""}
        </div>

        {/**  */}
        <div className="flex items-center text-sm capitalize gap-x-2">
          {sponsor.exhibitionHall && (
            <p>{`${sponsor.exhibitionHall}${
              !!sponsor.exhibitionHall && ","
            }`}</p>
          )}
          {sponsor.boothNumber && <p>{`Booth ${sponsor.boothNumber || ""}`}</p>}
        </div>

        <div className="flex items-center gap-x-3">
          <div className="flex items-center gap-x-2">
            <Location size={16} className="text-[#717171]" />
            <p>{`${sponsor.city ?? "City"}, ${sponsor.country ?? "Country"}`}</p>
          </div>
          {sponsor.industry !== undefined && (
            <div className="flex items-center gap-x-2">
              <IndustryIcon />
              <p>{sponsor.industry}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-x-6">
          {sponsor?.jobs?.length > 0 && (
            <button className="bg-[#20A0D8] bg-opacity-10 text-xs text-[#20A0D8] px-2 py-2 rounded-md">
              Hiring
            </button>
          )}
          {sponsor?.offers && (
            <button className="bg-[#F44444] bg-opacity-10 text-xs text-[#F44444] px-2 py-2 rounded-md">
              Promo
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}

// to be removed when changes are merged
function IndustryIcon() {
  return (
    <svg width="17" height="18" viewBox="0 0 17 18" fill="none">
      <g id="material-symbols-light:home-work-outline-rounded">
        <path
          id="Vector"
          d="M11.6578 6.77863L12.6843 6.75825L12.6639 5.73178L11.6374 5.75216L11.6578 6.77863ZM11.7107 9.44477L12.7372 9.42439L12.7168 8.39792L11.6904 8.4183L11.7107 9.44477ZM11.7637 12.1109L12.7901 12.0905L12.7698 11.0641L11.7433 11.0844L11.7637 12.1109ZM13.91 14.2221L11.3198 14.2735C11.2252 14.2754 11.1455 14.2449 11.0806 14.1822C11.0154 14.1195 10.9818 14.041 10.98 13.9468C10.9781 13.8526 11.0085 13.7729 11.0712 13.7076C11.134 13.6428 11.2124 13.6095 11.3066 13.6076L13.8961 13.5562C14.0156 13.5538 14.1131 13.5134 14.1884 13.435C14.2638 13.3566 14.3003 13.2577 14.2979 13.1381L14.1289 4.62582C14.1265 4.50629 14.0861 4.40885 14.0077 4.3335C13.9293 4.25815 13.8304 4.22167 13.7108 4.22404L8.12194 4.33499C8.00197 4.33737 7.90453 4.37776 7.82962 4.45615C7.75472 4.53454 7.71824 4.63351 7.72016 4.75305L7.74098 5.80151L7.06493 5.3355L7.05348 4.75895C7.04768 4.46656 7.14778 4.21319 7.35379 3.99884C7.5598 3.78449 7.80877 3.67441 8.10071 3.66862L13.6976 3.5575C13.9936 3.55163 14.2489 3.65214 14.4637 3.85902C14.679 4.06546 14.7896 4.31665 14.7954 4.61259L14.9644 13.1242C14.9703 13.4202 14.8698 13.6756 14.6629 13.8904C14.4565 14.1056 14.2059 14.2162 13.91 14.2221ZM2.73153 14.444C2.43559 14.4499 2.18021 14.3493 1.9654 14.1425C1.75014 13.936 1.63958 13.6848 1.63371 13.3889L1.55362 9.35502C1.55023 9.18394 1.58628 9.01808 1.66177 8.85744C1.73727 8.69725 1.84582 8.56729 1.98743 8.46757L4.86899 6.33462C5.05655 6.19843 5.26364 6.12808 5.49026 6.12358C5.71688 6.11908 5.9266 6.18115 6.11941 6.3098L9.08336 8.3267C9.22881 8.42072 9.34244 8.54626 9.42424 8.70334C9.50605 8.86086 9.54865 9.02515 9.55205 9.19623L9.63213 13.2301C9.63801 13.526 9.5375 13.7814 9.33061 13.9962C9.12418 14.2115 8.87299 14.3221 8.57705 14.3279L7.03868 14.3585C6.88627 14.3615 6.75727 14.3125 6.65169 14.2115C6.54655 14.1104 6.49246 13.9835 6.48943 13.8306L6.44058 11.3698L4.74891 11.4033L4.79776 13.8642C4.8008 14.017 4.75179 14.146 4.65075 14.2512C4.54926 14.3563 4.42231 14.4104 4.26989 14.4134L2.73153 14.444ZM2.22008 9.33779L2.30024 13.3757C2.30262 13.4952 2.343 13.5926 2.4214 13.668C2.4998 13.7433 2.59877 13.7798 2.7183 13.7774L4.12869 13.7494L4.07983 11.2886C4.0768 11.1357 4.1258 11.0067 4.22685 10.9016C4.32789 10.7965 4.45462 10.7424 4.60704 10.7394L6.55599 10.7007C6.7084 10.6976 6.83718 10.7466 6.94231 10.8477C7.04745 10.9487 7.10154 11.0757 7.10457 11.2285L7.15342 13.6894L8.56381 13.6614C8.68335 13.659 8.78079 13.6186 8.85613 13.5402C8.93148 13.4618 8.96797 13.3629 8.9656 13.2433L8.88543 9.20546C8.88408 9.13703 8.86791 9.07312 8.83695 9.01372C8.80555 8.95478 8.75966 8.90457 8.69927 8.86309L5.73589 6.87485C5.66644 6.82511 5.58906 6.80109 5.50374 6.80278C5.41843 6.80447 5.34206 6.83155 5.27464 6.88401L2.39251 8.9883C2.33381 9.03214 2.28995 9.08413 2.26091 9.14427C2.23233 9.20485 2.21872 9.26936 2.22008 9.33779Z"
          fill="#717171"
        />
      </g>
    </svg>
  );
}
