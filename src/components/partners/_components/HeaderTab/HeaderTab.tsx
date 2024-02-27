"use client";

import { usePartnersTab } from "@/context";
import { cn } from "@/lib";
import { Button } from "@/components";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PartnersEnum } from "@/types";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { AddPartners } from "..";

export function HeaderTab({
  eventId,
  refetch,
}: {
  eventId: string;
  refetch: () => Promise<null | undefined>;
}) {
  const { active, setActive } = usePartnersTab();
  const [isOpen, setOpen] = useState(false);
  const search = useSearchParams();



  function onClose() {
    setOpen((prev) => !prev);
  }
  return (
    <>
      <div className="flex pr-4 items-center justify-between w-full pb-4 border-b pt-16">
        <div className="flex items-center gap-x-3 sm:gap-x-8">
          <Button
            onClick={() => setActive(1)}
            className={cn(
              "bg-transparent",
              active === PartnersEnum.SPONSORS_TAB && "text-zikoro"
            )}
          >
            Sponsors
          </Button>
          <Button
            onClick={() => setActive(2)}
            className={cn(
              "bg-transparent",
              active === PartnersEnum.EXHIBITORS_TAB && "text-zikoro"
            )}
          >
            Exhibitors
          </Button>
        </div>
        <Button
          onClick={onClose}
          className="text-gray-50 bg-zikoro gap-x-2 h-11 sm:h-12 font-medium"
        >
          <PlusCircle size={22} />
          <p>Partner</p>
        </Button>
      </div>

      {isOpen && (
        <AddPartners refetchPartners={refetch} close={onClose} eventId={eventId}  />
      )}
    </>
  );
}
