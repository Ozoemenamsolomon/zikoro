"use client";

import { useState } from "react";
import { Button } from "@/components";
import { PlusCircle } from "@styled-icons/bootstrap/PlusCircle";
import Image from "next/image";
import Link from "next/link";
import { AddBanners } from "@/components/partners/_components";
import { TPartner } from "@/types";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

export function PartnerBanners({
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

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    fade: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const Comp =
    Array.isArray(partner?.banners) && partner?.banners?.length > 1
      ? Slider
      : "div";

  return (
    <>
      {
        <div className="w-full  flex flex-col">
          <div className="flex p-3 border-b items-center justify-between w-full">
            <p className="font-medium">Banners</p>

            <Button onClick={onClose} className="px-1 h-fit w-fit">
              <PlusCircle size={24} />
            </Button>
          </div>
          <Comp className=" z-[4] slider  p-2 h-full   sm:block " {...settings}>
            {Array.isArray(partner?.banners) &&
              partner?.banners.map(({ file, link }, idx) => (
                <Link href={link} target="blank">
                  <Image
                    src={file}
                    alt={`banners${idx}`}
                    width={700}
                    height={600}
                    className="w-full h-80 rounded-lg"
                  />
                </Link>
              ))}
          </Comp>
        </div>
      }

      {isOpen && (
        <AddBanners
          partner={partner}
          refetch={refetch}
          close={onClose}
          partnerId={partnerId}
        />
      )}
    </>
  );
}
