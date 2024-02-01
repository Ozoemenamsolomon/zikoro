"use client";
"use client"

import { useState } from "react";
import { Button } from "@/components";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import Image from "next/image";
import { AddBanners } from "@/components/partners/_components";
export function SponsorBanners() {
  const [isOpen, setOpen] = useState(false)

  function onClose() {
    setOpen((prev) => !prev)
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

        <Button
        onClick={onClose}
        className="px-1 h-fit w-fit">
          <PlusCircle size={24} />
        </Button>
      </div>
      <div className="w-full flex flex-col gap-y-3 px-3 py-4">
        {banners.map((image, idx) => (
          <Image
            src={image}
            alt={`banners${idx}`}
            width={700}
            height={600}
            className="w-full h-80 rounded-lg"
          />
        ))}
      </div>
    </div>

    {isOpen && <AddBanners close={onClose}/>}
    </>
 
  );
}
