"use client";

import { DoubleColumnIcon } from "@/constants";
import { StarFill } from "styled-icons/bootstrap";
import { Star } from "@styled-icons/bootstrap/Star";
import { Verified } from "styled-icons/material";
import { TReview } from "@/types";
import { cn } from "@/lib";

export function FeedBackCard({ review }: { review: TReview }) {
  return (
    <div className="w-[95%] items-start justify-start sm:w-[415px] flex flex-col gap-y-3 py-12 px-6 rounded-lg shadow bg-white">
      <DoubleColumnIcon />
      <p className="leading-6 items-start justify-start w-full flex flex-col">
        {review?.comments ?? ""}
      </p>
      <div className="flex items-center gap-x-3">
        {[1, 2, 3, 4, 5].map((v, index) => (
          <div
            key={index}
            className={cn(
              index + 1 <= Number(review?.rating) && "text-yellow-500"
            )}
          >
            {index + 1 <= review?.rating ? (
              <StarFill size={20} />
            ) : (
              <Star size={40} />
            )}
          </div>
        ))}
      </div>

      <div className="items-start justify-start w-full flex flex-col">
        <p className="font-semibold">Abdur Rasheed Saheed</p>
        <div className="text-green-600 flex items-center gap-x-2 text-xs font-medium">
          <Verified size={16} />
          <p>verified attende</p>
        </div>
      </div>
    </div>
  );
}
