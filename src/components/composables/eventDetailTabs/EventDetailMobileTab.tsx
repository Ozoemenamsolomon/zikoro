"use client";

import { User } from "@styled-icons/feather/User";
import { Bag } from "@styled-icons/bootstrap/Bag";
import { Handshake } from "@styled-icons/fa-regular/Handshake";
import { Speaker2 } from "@styled-icons/fluentui-system-regular/Speaker2";
import { useRouter } from "next/navigation";
import { MarketingIcon } from "@/constants";

export function EventDetailMobileTab({
  changeActiveState,
  eventId,
}: {
  changeActiveState: (n: number) => void;
  eventId: string;
}) {
  const router = useRouter();
  return (
    <div className="sm:hidden w-full grid grid-cols-3 gap-4 items-center justify-center">
      <button
        onClick={() => router.push(`/events/partners/${eventId}`)}
        className="flex flex-col gap-y-2 items-center justify-center"
      >
        <Handshake size={22} />
        <p>Partners</p>
      </button>
      <button
        onClick={() => changeActiveState(3)}
        className="flex flex-col gap-y-2 items-center justify-center"
      >
        <Speaker2 size={22} />
        <p>Speaker</p>
      </button>
      <button
        onClick={() => router.push(`/events/market-place/${eventId}/jobs`)}
        className="flex flex-col gap-y-2 items-center justify-center"
      >
        <Bag size={22} />
        <p>Jobs</p>
      </button>

      <button
        onClick={() => router.push(`/events/market-place/${eventId}/offers`)}
        className="flex flex-col gap-y-2 items-center justify-center"
      >
        <MarketingIcon color="#000000" />
        <p>Offers</p>
      </button>
    </div>
  );
}
