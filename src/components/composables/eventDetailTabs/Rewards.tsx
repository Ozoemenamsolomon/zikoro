"use client";

import { useGetData } from "@/hooks/services/request";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import {
  useVerifyUserAccess,
  useCheckTeamMember,
  useGetUserPoint,
} from "@/hooks";
import { Reward, RedeemPoint } from "@/types";
import { RewardCard } from "@/components/marketPlace/rewards/_components";
import { cn } from "@/lib";
export function Rewards({
  eventId,
  isEventHome,
}: {
  eventId: string;
  isEventHome?: boolean;
}) {
  const {
    data: rewards,
    isLoading: loadingRewards,
    getData: refetch,
  } = useGetData<Reward[]>(`/rewards/${eventId}`);
  const { totalPoints } = useGetUserPoint(eventId);
  const { isOrganizer, attendeeId } = useVerifyUserAccess(eventId);
  const { isIdPresent } = useCheckTeamMember({ eventId });
  const { data: redeemedRewards, getData } = useGetData<RedeemPoint[]>(
    `/rewards/${eventId}/redeemed`
  );
  return (
    <div className="w-full ">
      <div
        className={cn(
          "  w-full grid grid-cols-1 px-4 sm:grid-cols-2 md:grid-cols-3 gap-4  ",
          isEventHome && "md:grid-cols-2"
        )}
      >
        {loadingRewards && (
          <div className="w-full col-span-full h-[300px] flex items-center justify-center">
            <LoaderAlt size={30} className="animate-spin" />
          </div>
        )}
        {!loadingRewards && Array.isArray(rewards) && rewards?.length === 0 && (
          <div className="w-full col-span-full h-[300px] flex items-center justify-center">
            <p className="font-semibold text-sm">No Reward</p>
          </div>
        )}
        {!loadingRewards &&
          Array.isArray(rewards) &&
          rewards?.map((reward, index) => (
            <RewardCard
              key={index}
              refetch={refetch}
              refetchRedeemed={getData}
              redeemedRewards={redeemedRewards}
              attendeeId={attendeeId}
              attendeePoints={totalPoints}
              isOrganizer={isOrganizer || isIdPresent}
              reward={reward}
            />
          ))}
      </div>
    </div>
  );
}
