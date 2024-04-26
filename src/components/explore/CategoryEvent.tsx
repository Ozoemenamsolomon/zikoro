"use client";
import React from "react";

type CategoryEventProp = {
  categoryName: string;
  categoryCount: number;
};

export default function CategoryEvent({
  categoryName,
  categoryCount,
}: CategoryEventProp) {
  return (
    <div className="border-[1px] border-gray-200 rounded-md ">
      <div className=" h-[180px] lg:h-[200px] w-full flex items-center justify-center bg-gray-200 opacity-80 ">
        <p className="text-lg font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-4 ">
          {categoryName}
        </p>
      </div>
      <p className="text-sm font-normal text-black text-center py-4">
        {" "}
        {categoryCount}{" "}
      </p>
    </div>
  );
}
