"use client";

import { MarketPlaceLayout } from "../_components";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { Button } from "@/components";
import { useState } from "react";
import { useFetchSingleEvent, useFetchRewards } from "@/hooks";
import { CreateReward, RewardCard } from "./_components";
import { Reward } from "@/types";
export default function Rewards({ eventId }: { eventId: string }) {
  const [isOpen, setOpen] = useState(false);
  const { data: singleEvent } = useFetchSingleEvent(eventId);
  const {
    data,
    loading,
    refetch,
  }: { data: Reward[]; loading: boolean; refetch: () => Promise<any> } =
    useFetchRewards(eventId);

  function onClose() {
    setOpen((prev) => !prev);
  }

  return (
    <MarketPlaceLayout eventId={eventId}>
      <div className="flex items-end w-full justify-end px-4">
        <Button
          onClick={onClose}
          className="text-gray-50 bg-zikoro gap-x-2 h-11 sm:h-12 font-medium"
        >
          <PlusCircle size={22} />
          <p>Rewards</p>
        </Button>
      </div>

      <div className="w-full mt-3 sm:mt-5  grid gap-4 px-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(data) &&
          data?.map((item, index) => <RewardCard key={index} reward={item} />)}
      </div>

      {isOpen && (
        <CreateReward
          close={onClose}
          eventId={eventId}
          eventName={singleEvent?.eventTitle}
          refetch={refetch}
        />
      )}
    </MarketPlaceLayout>
  );
}
