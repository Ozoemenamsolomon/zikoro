"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FooterMail, FooterMenu } from "@/constants";
import { useRouter } from "next/navigation";

export default function AppointmentFooter() {
  const router = useRouter();
  const [isPreviewUp, setIsPreviewUp] = useState<boolean>(false);

  return (
    <div className="mt-[186px] bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end max-w-full xl:max-w-[97rem] mx-auto relative">
      {/* small screens Preview */}
      {isPreviewUp && (
        <div
          className="absolute block bottom-28 right-3 lg:hidden bg-white cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src="/appointments/otherPreviewS.png"
            width={273}
            height={278}
            alt=""
            className="w-[273px] h-[278px]"
          />
        </div>
      )}

      {/* big screens Preview */}
      {isPreviewUp && (
        <div
          className="absolute bottom-32 right-64 hidden lg:block cursor-pointer "
          onClick={() => router.push("/")}
        >
          <Image
            src="/appointments/otherPreviewB.png"
            width={557}
            height={307}
            alt=""
            className="w-[557px] h-[307px]"
          />
        </div>
      )}

      {/* main content */}
      <div className="py-4 lg:py-[41px] lg:max-w-[970px] xl:max-w-[1200px] mx-auto flex justify-between items-center px-3 lg:px-0 ">
        {/* left */}
        <Image
          src="/appointments/logoFooter.png"
          width={115}
          height={40}
          alt=""
          className="w-[115px] h-[40px]"
        />

        {/* right */}

        <ul className="flex gap-x-2 lg:gap-x-4">
          {/* First List Item */}
          <li
            className="flex flex-col gap-y-2 cursor-pointer justify-center items-center"
            onClick={() => setIsPreviewUp(!isPreviewUp)}
          >
            <FooterMenu />
            <span className="text-[10px] lg:text-base font-normal lg:font-medium">
              Other Products
            </span>
          </li>

          {/* Second List Item */}
          <li
            className="flex flex-col gap-y-2 cursor-pointer justify-center items-center"
            onClick={() => router.push("/bookings/contact")}
          >
            <FooterMail />
            <span className="text-[10px] lg:text-base font-normal lg:font-medium">
              Contact Us
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
