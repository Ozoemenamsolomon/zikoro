"use client";

import { cn } from "@/lib";
import { Button } from "@/components";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PlusCircle } from "styled-icons/bootstrap";
import { AddPartners } from "..";
import { AddPartnerManually } from "../modals/AddPartnerManually";

export function HeaderTab({
  eventId,
  refetch,
}: {
  eventId: string;
  refetch: () => Promise<any>;
}) {
  const [isOpen, setOpen] = useState(false);
  const search = useSearchParams();
  const router = useRouter();
  const query = search.get("p");

  function onClose() {
    setOpen((prev) => !prev);
  }
  return (
    <>
      <div className="flex bg-white pr-4 py-1 items-center pl-[60px] lg:pl-[18px] justify-between w-full  border-b ">
        <div className="flex items-center gap-x-3 sm:gap-x-8 text-sm">
          <Button
            onClick={() =>
              router.push(`/event/${eventId}/partners?p=sponsors`)
            }
            className={cn(
              "bg-transparent",
              query === "sponsors" && "text-basePrimary"
            )}
          >
            Sponsors
          </Button>
          <Button
            onClick={() =>
              router.push(`/event/${eventId}/partners?p=exhibitors`)
            }
            className={cn(
              "bg-transparent",
              query === "exhibitors" && "text-basePrimary"
            )}
          >
            Exhibitors
          </Button>
        </div>
        <Button
          onClick={onClose}
          className="text-gray-50 hidden bg-basePrimary gap-x-2 h-11 sm:h-12 font-medium"
        >
          <PlusCircle size={22} />
          <p>Partner</p>
        </Button>
      </div>

      {isOpen && (
        <AddPartnerManually
          refetchPartners={refetch}
          close={onClose}
          eventId={eventId}
        />
      )}
    </>
  );
}
