"use client";
import React from "react";

export default function AppointmentSec5() {
  return (
    <div className="mt-[140px] bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-[115px] px-[99px]max-w-full xl:max-w-[97rem] mx-auto">
      <div className="lg:max-w-[970px] xl:max-w-[1200px] mx-auto ">
        <p className="text-4xl text-white font-bold">
          Get Started with{" "}
          <span className="curly-snake-underline"> Zikoro Bookings</span>{" "}
          Today! {" "}
        </p>
        <p className="text-white mt-4">
          Experience the ease and efficiency of our automated appointment
          scheduling.{" "}
          <span className="inline lg:block ">
            {" "}
            Sign up for a free trial to discover how Zikoro Bookings can
            transform your business! 
          </span>
        </p>

        <button className="text-base font-semibold py-[10px] px-[64px] text-indigo-700 bg-white mt-[28px] rounded-[6px] ">
          Get started for free
        </button>
      </div>
    </div>
  );
}
