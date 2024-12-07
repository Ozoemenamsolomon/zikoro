"use client";

import { InlineIcon } from "@iconify/react";
import Image from "next/image";

function AwaitingReviewCard() {
  return (
    <div className="w-full p-3 bg-white rounded-lg border h-fit flex gap-y-3 sm:gap-y-4 flex-col items-start justify-start">
      <div className="w-full flex items-start justify-between ">
        <div className="flex items-center gap-x-2">
          <Image
            src="/zikoro.png"
            alt=""
            className="rounded-full h-11 w-11"
            width={100}
            height={100}
          />
          <div className="flex items-start flex-col justify-start gap-1">
            <p className="font-semibold text-sm sm:text-desktop">Anonymous</p>
            <p className="text-tiny sm:text-mobile text-gray-500">
              Today 11:00am
            </p>
          </div>
        </div>

        <div className="flex items-center gap-x-3">
          <button>
            <InlineIcon
              icon="codicon:check-all"
              color="#001fcc"
              fontSize={22}
            />
          </button>
          <button>
            <InlineIcon
              icon="mingcute:delete-line"
              color="#dc2626"
              fontSize={22}
            />
          </button>
        </div>
      </div>

      <p className="text-start">
        The question you asked will appear here, can you see it?
      </p>
    </div>
  );
}

export function AwaitingReview() {
  return (
    <div className="w-full max-w-2xl overflow-y-auto  no-scrollbar h-full mx-auto">
          <div className="w-full flex flex-col items-start justify-start gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6].map((_) => (
            <AwaitingReviewCard
              key={_}
              
            />
          ))}
        </div>
    </div>
  );
}
