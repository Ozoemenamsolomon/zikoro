"use client"

import { MarketPlaceLayout } from "../_components";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { Button } from "@/components";
import { useState } from "react";
import { CreateReward, RewardCard } from "./_components";
export default function Rewards({ eventId }: { eventId: string }) {
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }
  const data = {
    rewardTitle: "",
    image: "",
    quantity: "",
    pointNeeded: "",
  };

  return (
    <MarketPlaceLayout eventId={eventId}>
      <div className="flex items-end w-full justify-end px-4">
        <Button className="text-gray-50 bg-zikoro gap-x-2 h-11 sm:h-12 font-medium">
          <PlusCircle size={22} />
          <p>Rewards</p>
        </Button>
      </div>

      <div className="w-full mt-3 sm:mt-5  grid gap-4 px-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((_) => (
          <RewardCard key={_} reward={data} />
        ))}
      </div>

      {isOpen && <CreateReward close={onClose} />}
    </MarketPlaceLayout>
  );
}
