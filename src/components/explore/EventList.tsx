"use client";
import React from "react";
import Event from "./Event";
import RightArrow from "../svg/RightArrow";
import { useRouter } from "next/navigation";
import { LocationIcon1, LocationIcon2, } from "../svg/Constants";

export default function EventList() {
  const router = useRouter();
  return (
    <div className="mt-[150px] max-w-6xl mx-auto px-3 lg:px-0">
      {/* header */}
      <div className="flex justify-between">
        <div className="flex items-center gap-x-1 lg:gap-x-3">
            <LocationIcon1/>         
          <p className="font-semibold text-[20px] lg:text-[32px]">Lagos</p>
        </div>
        <div
          onClick={() => router.push("/explore/featured-events")}
          className="hidden lg:flex gap-x-4 cursor-pointer items-center"
        >
          <p className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-xl font-semibold">
            See All
          </p>
          <RightArrow />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-0 md:gap-x-4 lg:gap-x-4 gap-y-5 lg:gap-y-0 mt-[10px] lg:mt-[50px] bg-white  ">
        <Event />
        <Event />
        <Event />
        <Event />
      </div>

      <div
        onClick={() => router.push("/explore/featured-events")}
        className=" justify-end mt-[30px] flex lg:hidden gap-x-4 cursor-pointer items-center"
      >
        <p className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-xl font-semibold">
          See All
        </p>
        <RightArrow />
      </div>
    </div>
  );
}
