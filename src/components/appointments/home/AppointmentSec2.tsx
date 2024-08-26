"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AppointmentSec2() {
  const router = useRouter();
  return (

    <div className=" px-3 lg:px-0 mt-[60px] flex flex-col lg:flex-row justify-between max-w-full xl:max-w-[95rem] mx-auto  ">
      {/* left */}
      <Image
        src="/appointments/section21.png"
        width={679}
        height={640}
        alt=""
      />

      {/* center */}
      <div className="flex flex-col justify-between">
        <div>
          <div className=" flex items-center justify-center mx-auto">
            <button
              onClick={() => router.push("/home")}
              className="text-white font-semibold text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-4 px-5 xl:px-[64px] rounded-lg"
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
      <Image
        src="/appointments/section22.png"
        width={679}
        height={640}
        alt=""
      />
    </div>
  );
}