"use client";
import { QuestonMarkIcon2 } from "@/constants";
import React from "react";
import Image from "next/image";

export default function AppointmentSec4() {
  return (
    <div className=" px-5 mt-[160px] max-w-[1200px] mx-auto ">
      <div className=" flex justify-center">
        <QuestonMarkIcon2 />
      </div>
      {/* Section1 */}
      <div className="flex flex-col lg:flex-row gap-5 mt-[87px]">
        {/* left */}
        <div className="w-full lg:w-1/2 bg-white pt-4 pl-4">
          <p className="text-xl font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end leading-none text-left ">
            Instant Booking, Anytime. 
          </p>
          <p className="text-[14px] mt-6">
            A user-friendly website to schedule{" "}
            <span className="inline lg:block">
              {" "}
              clients' appointments 24/7.
            </span>{" "}
             
          </p>

          <div className="flex justify-end mt-[50px]">
            <Image
              src="/appointments/section41.webp"
              width={489}
              height={243}
              alt=""
              className="lg:w-[489px] xl:w-[489px] h-[243px]"
            />
          </div>
        </div>
        {/* Right */}
        <div className="w-full lg:w-1/2 bg-white pt-4 pl-4">
          <p className="text-xl font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end leading-none text-left ">
            Automated Reminders & Follow-Ups 
          </p>
          <p className="text-[14px] mt-6">
            Minimize no-shows with automatic email and SMS{" "}
            <span className="inline lg:block">
              {" "}
              reminders. Keep clients engaged with seamless follow-up messages.
            </span>
          </p>

          <div className="flex justify-end mt-[50px]">
            <Image
              src="/appointments/section42.webp"
              width={489}
              height={243}
              alt=""
              className="lg:w-[489px] xl:w-[489px] h-[243px]"
            />
          </div>
        </div>
      </div>
      {/* Section2 */}
      <div className="flex flex-col lg:flex-row gap-5 mt-5">
        {/* left */}
        <div className="w-full lg:w-1/2 bg-white pt-4 pl-4">
          <p className="text-xl font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end leading-none text-left ">
            Powerful Analytics 
          </p>
          <p className="text-[14px] mt-6">
            With our comprehensive analytics, you
            <span className="inline lg:block">
              can gain deep insights into your
            </span>
            business. Track trends, client preferences,
            <span> and performance metrics.</span> 
          </p>

          <div className="flex justify-end mt-[40px]">
            <Image
              src="/appointments/section43.webp"
              width={489}
              height={243}
              alt=""
              className="lg:w-[489px] xl:w-[489px] h-[243px]"
            />
          </div>
        </div>

        {/* Middle */}
        <div className="w-full lg:w-1/2 bg-white pt-4 pl-4">
          <p className="text-xl font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end leading-none text-left ">
            Personalized Client Care 
          </p>
          <p className="text-[14px] mt-6">
            Maintain detailed client records and{" "}
            <span className="inline lg:block">
              provide personalized services that{" "}
            </span>{" "}
            keep them coming back.   
          </p>

          <div className="flex justify-end mt-[40px]">
            <Image
              src="/appointments/section44.webp"
              width={327}
              height={295}
              alt=""
              className="lg:w-[315px] xl:w-[327px] h-[295px]"
            />
          </div>
        </div>
        {/* Right */}
        <div className="w-full lg:w-1/2 bg-white pt-4 pl-4">
          <p className="text-xl font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end leading-none text-left ">
            Custom Booking Pages 
          </p>
          <p className="text-[14px] mt-6">
            Create a branded booking page that{" "}
            <span className="inline lg:block">
              impresses clients and reflects{" "}
            </span>
            your business’s unique style. 
          </p>

          <div className="flex justify-end mt-[40px]">
            <Image
              src="/appointments/section45.webp"
              width={386}
              height={378}
              alt=""
              className="lg:w-[386px] xl:w-[386px] h-[378px]"
            />
          </div>
        </div>
      </div>{" "}
    </div>
  );
}
