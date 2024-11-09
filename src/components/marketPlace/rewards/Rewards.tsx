"use client";

import { MarketPlaceLayout } from "../_components";
import { PlusCircle } from "styled-icons/bootstrap";
import { Button } from "@/components";
import { useState } from "react";
import {
  useFetchSingleEvent,
  useVerifyUserAccess,
  useCheckTeamMember,
  useGetUserPoint,
} from "@/hooks";
import { CreateReward, RewardCard } from "./_components";
import { EmptyCard } from "@/components/composables";
import { Loader2 } from "styled-icons/remix-fill";
import { Reward, RedeemPoint } from "@/types";
import { cn } from "@/lib";
import { useGetData } from "@/hooks/services/request";
export default function Rewards({ eventId }: { eventId: string }) {
  const [isOpen, setOpen] = useState(false);
  const { data: singleEvent } = useFetchSingleEvent(eventId);
  const { isOrganizer, attendeeId } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const { totalPoints } = useGetUserPoint(eventId);
  const {
    data,
    isLoading: loading,
    getData: refetch,
  } = useGetData<Reward[]>(`/rewards/${eventId}`);
  const {data: redeemedRewards, getData} = useGetData<RedeemPoint[]>(`/rewards/${eventId}/redeemed`)

  function onClose() {
    setOpen((prev) => !prev);
  }



  return (
    <MarketPlaceLayout eventId={eventId}>
      <div className="flex items-end w-full justify-end ">
        <Button
          onClick={onClose}
          className={cn(
            "text-gray-50 bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium hidden",
            (isIdPresent || isOrganizer) && "flex"
          )}
        >
          <PlusCircle size={22} />
          <p>Rewards</p>
        </Button>
      </div>

      <div className="w-full mt-3 sm:mt-5  grid gap-4  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 min-[1300px]:grid-cols-3">
        {loading && (
          <div className="w-full col-span-full h-[60vh] flex items-center justify-center">
            <Loader2 size={30} className="animate-spin" />
          </div>
        )}
        {!loading && Array.isArray(data) && data?.length === 0 && (
          <EmptyCard height="80" width="82" text="No available Reward" />
        )}

        {Array.isArray(data) &&
          data?.map((item, index) => (
            <RewardCard
              key={index}
              refetch={refetch}
              refetchRedeemed={getData}
              redeemedRewards={redeemedRewards}
              attendeeId={attendeeId}
              reward={item}
              attendeePoints={totalPoints}
              isOrganizer={isOrganizer || isIdPresent}
            />
          ))}
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
