"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AppointmentSec2() {
  const router = useRouter();
  return (
    <div>
      {/* big screen */}
      <div className=" px-3 lg:px-0 mt-[60px] hidden lg:flex justify-between max-w-full xl:max-w-[97rem] mx-auto  ">
        {/* left */}
        <div className="w-[33%]">
          <Image
            src="/appointments/section21.png"
            width={679}
            height={640}
            alt=""
            className="w-full h-full"
          />
        </div>

        {/* center */}
        <div className="flex flex-col justify-between w-[33%]">
          <div>
            <div className=" flex items-center justify-center mx-auto">
              <button
                onClick={() => router.push("/appointments")}
                className="text-white font-semibold text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[10px] px-[64px] rounded-lg"
              >
                Get Started For Free!
              </button>
            </div>

            <p className=" text-xs lg:text-sm font-light mt-2 lg:mt-3 text-center">
              No credit card required.
            </p>
          </div>
          <Image
            src="/appointments/woman.png"
            width={449}
            height={375}
            alt=""
          />
        </div>

        {/* right */}
        <div className="w-[33%]">
          <Image
            src="/appointments/section22.png"
            width={679}
            height={640}
            alt=""
            className="w-full"
          />
        </div>
      </div>

      {/* small screen */}
      <div className="block lg:hidden">
        <div className="flex justify-between">
          <Image
            src="/appointments/section21s.png"
            width={230}
            height={231}
            alt=""
            className="w-[230px] md:w-[350px] h-full object-contain"
          />
          <Image
            src="/appointments/section22s.png"
            width={230}
            height={231}
            alt=""
            className="w-[230px] md:w-[350px] h-full object-contain"
          />
        </div>

        <div className="flex justify-center">
          <Image
            src="/appointments/woman.png"
            width={340}
            height={284}
            alt=""
            className="w-[340px] md:w-[450px] h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
