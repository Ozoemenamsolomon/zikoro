"use client";
import React from "react";
import { Play } from "@/constants/icons";

export default function Section2() {
  return (
    <div className="mt-20 max-w-full mx-auto lg:max-w-6xl px-5 ">
      <p className="gradient-text font-bold bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-center text-2xl lg:text-4xl">
        Made for people. <br /> Built for engagements and connections.
      </p>

      <div className="bg-white p-1 lg:p-4 border-[.5px] border-indigo-800 mt-5 lg:mt-12 rounded-lg lg:rounded-[42px]">
        <div className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end flex justify-center items-center w-full h-[200px] lg:h-[660px] rounded-lg lg:rounded-3xl cursor-pointer">
          <Play />
        </div>
      </div>
    </div>
  );
}
