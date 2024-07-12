"use client";

import { useState } from "react";
import { Button } from "@/components";
import { PlusCircle } from "styled-icons/bootstrap";
import { CreatePromo, Offers } from "@/components/partners/_components";
import { TPartner, TAttendee } from "@/types";

export function PromotionalOffer({
  partner,
  partnerId,
  refetch,
  isHaveAccess,
  isOrganizer,
  attendee
}: {
  partner: TPartner | null;
  refetch: () => Promise<null | undefined>;
  partnerId: string;
  isHaveAccess: boolean;
  isOrganizer: boolean;
  attendee?:TAttendee;
}) {
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }
  return (
    <>
      <div className="w-full  flex flex-col">
        <div className="flex p-3 border-y items-center justify-between w-full">
          <p className="font-medium">Promotional Offers</p>

         {isHaveAccess && <Button onClick={onClose} className="px-1 h-fit w-fit">
            <PlusCircle size={24} />
          </Button>}
        </div>

        <Offers isOrganizer={isOrganizer} attendee={attendee} data={partner?.offers}/>
      </div>

      {isOpen && (
        <CreatePromo
          close={onClose}
          partner={partner}
          partnerId={partnerId}
          refetch={refetch}
        />
      )}
    </>
  );
}
