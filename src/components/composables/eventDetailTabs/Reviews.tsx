"use client";

import { useGetEventReviews } from "@/hooks";
import { FeedBackCard } from "@/components/published";
import { LoaderAlt } from "styled-icons/boxicons-regular";
export function Reviews({ eventId }: { eventId: string }) {
  const { reviews, isLoading } = useGetEventReviews(eventId);
  return (
    <div className="w-full p-3 bg-white">
      <div className="w-full h-full rounded-lg border p-2">
        <h3 className="pb-2 w-full text-center">Event Reviews</h3>

        <div className="w-full mt-3 grid grid-cols-1 gap-4">
          {isLoading && (
            <div className="w-full flex items-center justify-center h-[10rem] ">
              <LoaderAlt size={24} className="animate-spin" />
            </div>
          )}
          {!isLoading &&
            Array.isArray(reviews) &&
            reviews.map((review, index) => (
              <FeedBackCard review={review} key={index} />
            ))}
        </div>
      </div>
    </div>
  );
}
