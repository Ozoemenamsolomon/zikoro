"use client";

import { Star } from "@styled-icons/fluentui-system-regular/Star";
export function Engagement() {
  return (
    <div className="lg:col-span-3 p-2 lg:p-4 w-full">
      <div className="w-full h-fit bg-gray-200 rounded-xl">
        <h2 className="text-base sm:text-xl font-semibold border-b border-gray-300 p-4 w-full text-start">
          Reviews
        </h2>

        <div className="w-full flex flex-col p-6 items-start justify-start gap-y-2">
          <h3 className="text-base sm:text-lg font-semibold">
            How would you rate this session?
          </h3>
          <div className="w-[80%] mx-auto space-y-2">
            <div className="grid text-gray-500 grid-cols-5 gap-3 w-full">
              <div className="flex items-center flex-col justify-center">
                <Star size={40} />
                <p className="text-xs">Bad</p>
              </div>
              <Star size={40} />
              <Star size={40} />
              <Star size={40} />
              <div className="flex items-center flex-col justify-center">
                <Star size={40} />
                <p className="text-xs">Excellent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
