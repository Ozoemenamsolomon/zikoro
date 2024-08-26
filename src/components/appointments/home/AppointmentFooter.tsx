"use client";
import React from "react";
import Image from "next/image";

export default function AppointmentFooter() {
  return (
    <div className="mt-[186px] bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end ">
      <div className="py-4 lg:py-[41px] px-5 flex justify-between items-center max-w-full lg:max-w-[1235px] mx-auto ">
        {/* left */}
        <Image
          src="/appointments/logoFooter.png"
          width={115}
          height={40}
          alt=""
          className="w-[115px] h-[40px]"
        />

        {/* right */}
        <ul className="flex gap-x-3 lg:gap-x-4">
          <li className="text-base font-medium cursor-pointer">Other Products</li>
          <li className="text-base font-medium cursor-pointer">Contact Us</li>
        </ul>
      </div>
    </div>
  );
}
