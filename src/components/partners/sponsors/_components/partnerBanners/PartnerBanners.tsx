"use client";
"use client";

import { useState } from "react";
import { Button } from "@/components";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import Image from "next/image";
import { AddBanners } from "@/components/partners/_components";
import { TPartner } from "@/types";
import { EmptyCard } from "@/components/composables";

export function PartnerBanners({
  partner,
  partnerId,
  refetch
}: {
  partner: TPartner | null;
  refetch: () => Promise<null | undefined>
  partnerId: string;
}) {
  const [isOpen, setOpen] = useState(false);

  function onClose() {
    setOpen((prev) => !prev);
  }

  const banners = [
    "/images/banner1.png",
    "/images/banner2.png",
    "/images/banner3.png",
  ];
  return (
    <>
      <div className="w-full lg:col-span-3 flex flex-col">
        <div className="flex p-3 border-b items-center justify-between w-full">
          <p className="font-medium">Banners</p>

          <Button onClick={onClose} className="px-1 h-fit w-fit">
            <PlusCircle size={24} />
          </Button>
        </div>
        <div className="w-full flex flex-col gap-y-3 px-3 py-4">
          {partner?.banners === null  && (
            <EmptyCard height="80" width="82" text="No available Banner" />
          )}
          {Array.isArray(partner?.banners) &&
            partner?.banners.map(({ file }, idx) => (
              <Image
                src={file}
                alt={`banners${idx}`}
                width={700}
                height={600}
                className="w-full h-80 rounded-lg"
              />
            ))}
        </div>
      </div>

      {isOpen && <AddBanners partner={partner} refetch={refetch} close={onClose} partnerId={partnerId} />}
    </>
  );
}
