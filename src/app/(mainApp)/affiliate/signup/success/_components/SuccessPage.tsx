"use client";
import { useGetData } from "@/hooks/services/request";
import { TAffiliate, TAffiliateLink } from "@/types";
import { useSearchParams } from "next/navigation";
import React from "react";
import { TbLoader3 } from "react-icons/tb";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";
import { Copy } from "styled-icons/boxicons-regular";

const SuccessPage = ({
  eventAlias,
  attendeeAlias,
}: {
  eventAlias: string;
  attendeeAlias: string;
}) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const hasCopiedText = Boolean(copiedText);

  console.log(eventAlias, attendeeAlias);

  const { data, isLoading } = useGetData<{
    affiliate: TAffiliate;
    affiliateLink: TAffiliateLink;
  }>(
    `marketing/affiliate/attendee/signup?eventAlias=${eventAlias}&attendeeAlias=${attendeeAlias}`,
    true,
    {}
  );

  console.log(data);

  return (
    <>
      {isLoading && (
        <div className="w-full h-full inset-0 fixed z-[300] bg-white">
          <div className="absolute inset-0 m-auto w-[95%] sm:w-[400px] gap-y-2 h-[300px]  rounded-lg flex flex-col items-center justify-center">
            <TbLoader3 size={30} className="text-basePrimary animate-spin" />
            <p className="text-white">Processing...</p>
          </div>
        </div>
      )}
      <main className="min-h-screen w-full flex flex-col bg-basePrimary/10 justify-between items-center">
        <div />
        <section className="flex py-8 px-4 w-4/5 md:w-2/5 bg-white flex-col items-center justify-center gap-4 rounded-2xl text-gray-800 text-center">
          <div className="rounded-full p-4 bg-basePrimary/20 text-basePrimary">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 24 24"
              height="2.5em"
              width="2.5em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12,2C6.486,2,2,6.486,2,12s4.486,10,10,10s10-4.486,10-10S17.514,2,12,2z M12,20c-4.411,0-8-3.589-8-8s3.589-8,8-8 s8,3.589,8,8S16.411,20,12,20z" />
              <path d="M14.829,14.828c-0.185,0.184-0.384,0.349-0.592,0.489c-0.217,0.146-0.445,0.27-0.68,0.369 c-0.244,0.103-0.496,0.181-0.749,0.233c-0.531,0.108-1.087,0.108-1.616,0c-0.254-0.052-0.506-0.13-0.75-0.233 c-0.234-0.099-0.463-0.223-0.679-0.369c-0.209-0.141-0.408-0.305-0.593-0.489c-0.181-0.181-0.346-0.38-0.488-0.592l-1.658,1.119 c0.215,0.318,0.462,0.617,0.734,0.889c0.273,0.273,0.572,0.52,0.887,0.731c0.323,0.218,0.666,0.404,1.02,0.553 c0.365,0.154,0.744,0.272,1.128,0.35C11.189,17.959,11.596,18,12,18s0.811-0.041,1.208-0.122c0.383-0.078,0.762-0.196,1.127-0.35 c0.354-0.149,0.696-0.335,1.021-0.553c0.313-0.212,0.612-0.458,0.886-0.731c0.272-0.271,0.52-0.571,0.734-0.889l-1.658-1.119 C15.175,14.448,15.01,14.647,14.829,14.828z" />
              <circle cx="8.5" cy="10.5" r="1.5" />
              <circle cx="15.493" cy="10.493" r="1.493" />
            </svg>
          </div>
          <p>
            Welcome to the {data.affiliateLink?.eventName} Affiliate Program!
          </p>
          <p>🎉 You’ve successfully signed up as an affiliate! 🎉</p>
          <p>
            We're excited to have you on board. Your unique affiliate link is
            ready to go:
          </p>
          <div className="w-full flex gap-2 text-sm md:text-base bg-basePrimary/10 px-2 py-1 rounded-md">
            <p className="flex-[70%] overflow-hidden truncate">
              {data.affiliateLink?.affiliateLink}
            </p>
            <button
              onClick={() =>
                copyToClipboard(data.affiliateLink?.affiliateLink ?? "")
              }
              className="text-white"
            >
              <Copy className="w-5 h-5 text-black" />
            </button>
          </div>
          <p className="text-xl font-bold text-black"></p>
          <p>
            Share this link with your network to start earning rewards. The more
            people you register, the more you earn!
          </p>

          <p>
            Thank you for being a part of our community and helping us make{" "}
            {data.affiliateLink?.eventName} even more successful.
          </p>
        </section>
        <p className="justify-self-end text-lg text-gray-800">
          To create events, sign up on{" "}
          <a href="www.zikoro.com" className="underline text-basePrimary">
            www.zikoro.com
          </a>
        </p>
      </main>
    </>
  );
};

export default SuccessPage;
