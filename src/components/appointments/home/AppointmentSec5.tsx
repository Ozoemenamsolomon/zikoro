"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function AppointmentSec5() {
  const router = useRouter();

  return (
    <div className="mt-[140px] bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[35px] lg:py-[115px] px-5 lg:px-[99px]max-w-full xl:max-w-[97rem] mx-auto">
      <div className="maw-w-full lg:max-w-[970px] xl:max-w-[1200px] mx-auto px-3 lg:px-0 ">
        <p className=" text-3xl lg:text-4xl text-white text-center lg:text-left font-extrabold lg:font-bold">
          Get Started with{" "}
          <span className="curly-snake-underline"> Zikoro Bookings</span>{" "}
          Today! {" "}
        </p>
        <p className=" text-[14px] lg:text-base text-white mt-5 text-center lg:text-left ">
          Experience the ease and efficiency of our automated appointment
          scheduling.{" "}
          <span className="inline lg:block ">
            {" "}
            Sign up for a free trial to discover how Zikoro Bookings can
            transform your business! 
          </span>
        </p>
        <button
          onClick={() => router.push("/bookings/login")}
          className="text-base font-semibold py-[10px] px-[64px] text-indigo-700 bg-white mt-[28px] rounded-[6px] w-full lg:w-fit "
        >
          Get started for free
        </button>
      </div>
    </div>
  );
}
