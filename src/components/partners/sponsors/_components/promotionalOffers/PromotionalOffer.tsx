"use client"

import { useState } from "react";
import { Button } from "@/components";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import { Offers } from "@/components/partners/_components";
import { TPartner } from "@/types";

export function PromotionalOffer({
    partner,
    partnerId,
    refetch,
  }: {
    partner: TPartner | null;
    refetch: () => Promise<null | undefined>;
    partnerId: string;
  }) {
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }
  return (
    <div className="w-full  flex flex-col">
      <div className="flex p-3 border-y items-center justify-between w-full">
        <p className="font-medium">Promotional Offers</p>

        <Button onClick={onClose} className="px-1 h-fit w-fit">
          <PlusCircle size={24} />
        </Button>
      </div>

      <Offers/>
    </div>
  );
}
