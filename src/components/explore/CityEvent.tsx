"use client";
import React from "react";
import { useRouter } from "next/navigation";

type CityEventProp = {
  cityName: string;
  cityCount: number;
};

export default function CityEvent({ cityName, cityCount }: CityEventProp) {
  const router = useRouter();
  const encodedCategoryName = encodeURIComponent(cityName);

  return (
    <div
      className="border-[1px] border-gray-200 rounded-md cursor-pointer"
      onClick={() =>
        router.push(`/explore/featured-events?query=${encodedCategoryName}`)
      }
    >
      <div className=" h-[180px] lg:h-[200px] w-full flex items-center justify-center bg-gray-200 opacity-80 ">
        <p className="text-lg  font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-4 h-">
          {cityName}
        </p>
      </div>
      <p className="text-sm font-normal text-black text-center py-4">
        {" "}
        {cityCount}{" "}
      </p>
    </div>
  );
}
