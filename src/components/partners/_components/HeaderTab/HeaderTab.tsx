"use client";

import { cn } from "@/lib";
import { Button } from "@/components";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { AddPartners } from "..";

export function HeaderTab({
  eventId,
  refetch,
}: {
  eventId: string;
  refetch: () => Promise<null | undefined>;
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
      <div className="flex pr-4 items-center justify-between w-full pb-3 border-b pt-10">
        <div className="flex items-center gap-x-3 sm:gap-x-8 text-sm">
          <Button
            onClick={() =>
              router.push(`/events/partners/${eventId}?p=sponsors`)
            }
            className={cn(
              "bg-transparent",
              query === "sponsors" && "text-zikoro"
            )}
          >
            Sponsors
          </Button>
          <Button
            onClick={() =>
              router.push(`/events/partners/${eventId}?p=exhibitors`)
            }
            className={cn(
              "bg-transparent",
              query === "exhibitors" && "text-zikoro"
            )}
          >
            Exhibitors
          </Button>
        </div>
        <Button
          onClick={onClose}
          className="text-gray-50 hidden bg-zikoro gap-x-2 h-11 sm:h-12 font-medium"
        >
          <PlusCircle size={22} />
          <p>Partner</p>
        </Button>
      </div>

      {isOpen && (
        <AddPartners
          refetchPartners={refetch}
          close={onClose}
          eventId={eventId}
        />
      )}
    </>
  );
}
