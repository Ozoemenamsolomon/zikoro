"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AppointmentSec1() {
  const router = useRouter();
  return (
    <div className=" px-5 mt-[100px] lg:mt-[140px] relative max-w-full xl:max-w-7xl mx-0 xl:mx-auto">
      <Image
        src="/appointments/AppointmentCalendar.png"
        width={82}
        height={82}
        alt=""
        className="w-[82px] h-[82px] absolute top-[-84px] right-[9rem] md:right-[14rem] xl:right-[19rem]"
      />{" "}
      <Image
        src="/appointments/AppointmentCheck.png"
        width={122}
        height={92}
        alt=""
        className="w-[122px] h-[92px] absolute bottom-16 lg:bottom-0  right-2 lg:right-16 xl:right-32"
      />{" "}
      <Image
        src="/appointments/AppointmentClock.png"
        width={138}
        height={138}
        alt=""
        className="w-[138px] h-[px] absolute bottom-12 lg:bottom-0 left-2 lg:left-4 xl:left-16"
      />
      <div className="max-w-full lg:max-w-[1019px] mx-auto">
        <p className=" text-[30px] lg:text-[90px] xl:text-[90px] font-extrabold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-center leading-none">
          Effortless Bookings, <span className="">Happier Clients</span>
        </p>
        <p className="max-w-full lg:max-w-[698px] mx-auto text-center text-[14px] text-base font-normal mt-5 lg:mt-10">
          Simplify your appointments,{" "}
          <span className="font-medium">improve </span>
          clients interactions, and run an
          <span className="font-medium"> effectient{" "}</span> business.
          <br className="block lg:hidden" /> Whether you're a
          <span className="font-medium">{" "}freelancer </span> small
          <span className="font-medium">{" "}business owner </span>
          or a<span className="font-medium">{" "}large enterprise, </span>
          Zikoro Bookings has the features you need to manage your appointments
          effortlessly. 
        </p>
      </div>


      <div className="flex flex-col lg:hidden mt-20">
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
      </div>
    </div>
  );
}
