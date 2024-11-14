"use client";

import { DoubleColumnIcon } from "@/constants";
import { StarFill } from "styled-icons/bootstrap";
import { Star } from "styled-icons/bootstrap";
import { Verified } from "styled-icons/material";
import { TFeedBack } from "@/types";
import { cn } from "@/lib";
import { InlineIcon } from "@iconify/react";

export function FeedBackCard({ review, className }: { review: TFeedBack; className?:string }) {
  return (
    <div className={cn("w-full items-start border justify-start flex flex-col gap-y-3 py-8 px-6 rounded-lg  bg-white", className)}>
      <DoubleColumnIcon />
      <p className="leading-6 line-clamp-3 items-start justify-start w-full flex flex-col">
        {review?.comments ?? ""}
      </p>
      <div className="flex items-center gap-x-2">
        {[1, 2, 3, 4, 5].map((v, index) => (
          <div
            key={index}
            className={cn(
              index + 1 <= Number(review?.rating) && "text-basePrimary"
            )}
          >
            {index + 1 <= review?.rating ? (
              <InlineIcon
                icon="ic:twotone-star"
                color="#001fcc"
                fontSize={24}
              />
            ) : (
              <InlineIcon icon="ic:twotone-star" fontSize={24} />
            )}
          </div>
        ))}
      </div>

      <div className="items-start justify-start w-full flex flex-col">
        <p className="font-semibold">{`${review?.attendees?.firstName ?? ""} ${
          review?.attendees?.lastName ?? ""
        }`}</p>
        <div className="text-green-600 flex items-center gap-x-2 text-xs font-medium">
          <Verified size={16} />
          <p>verified attendee</p>
        </div>
      </div>
    </div>
  );
}
