"use client";
import React from "react";
import Image from "next/image";

export default function AppointmentSec3() {
  return (
    <div className="mt-[90px] lg:mt-[164px] hidden lg:flex gap-x-[18px] max-w-full xl:max-w-[97rem] mx-auto">
      {/* Image1 */}
      <div className="w-full lg:w-1/3 xl:w-1/4">
        <Image
          src="/appointments/baber.png"
          width={362}
          height={504}
          alt=""
          className="w-full  h-[504px]"
        />
      </div>

      {/* Center Images and text */}
      <div className=" flex flex-col justify-between gap-y-5 w-full lg:w-1/3 xl:w-2/4">
        <p className="text-sm lg:text-base xl:text-xl font-semibold text-indigo-700 text-center">
          Experience seamless client scheduling, no matter your profession.
        </p>
        <div className="flex justify-between ">
          <Image
            src="/appointments/hairdresser.png"
            width={362}
            height={505}
            alt=""
            className="w-full xl:w-1/2 inline lg:hidden xl:inline h-[504px] "
          />
          <Image
            src="/appointments/doctor.png"
            width={363.5}
            height={505}
            alt=""
            className="w-full xl:w-1/2 h-[504px]"
          />
        </div>
      </div>

      {/* Image3 */}
      <div className="w-full lg:w-1/3 xl:w-1/4">
        <Image
          src="/appointments/photographer.png"
          width={333}
          height={504.5}
          alt=""
          className="w-full h-[504px]"
        />
      </div>

      {/* slider */}
    </div>
  );
}
