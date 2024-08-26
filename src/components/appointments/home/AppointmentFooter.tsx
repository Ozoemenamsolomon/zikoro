"use client";
import React from "react";
import Image from "next/image";
import { FooterMail, FooterMenu } from "@/constants";

export default function AppointmentFooter() {
  return (
    <div className="mt-[186px] bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end max-w-full xl:max-w-[97rem] mx-auto">
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
          <li className="flex flex-col gap-y-2 cursor-pointer justify-center items-center">
            <FooterMenu />
            <span className="text-[10px] lg:text-base font-normal lg:font-medium">
              Other Products
            </span>
          </li>

          {/* Second List Item */}
          <li className="flex flex-col gap-y-2 cursor-pointer justify-center items-center">
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
