"use client";
import React from "react";
import { Timer, People, Database } from "@/constants/icons";

export default function Section3() {
  return (
    <div className="mt-12 lg:mt-28 bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end">
      <div className="flex flex-col lg:flex-row lg:max-w-6xl mx-auto py-12 lg:py-32 items-center justify-center lg:justify-between space-y-8 lg:space-y-0">
        <div className="flex flex-col lg:flex-row  space-x-0 lg:space-x-6 items-center justify-center">
          <Timer />
          <p className="text-2xl lg:text-4xl font-bold text-white text-center lg:text-left mt-2 lg:mt-0">
            10 mins <br />{" "}
            <span className="text-base lg:text-2xl font-normal">
              {" "}
              to publish an event{" "}
            </span>{" "}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-6  items-center justify-center">
          <People />
          <p className="text-2xl lg:text-4xl font-bold text-white text-center lg:text-left mt-2 lg:mt-0">
            100% <br />{" "}
            <span className="text-base lg:text-2xl font-normal">
              {" "}
              attendee engagement{" "}
            </span>{" "}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-6 items-center justify-center">
          <Database />
          <p className="text-2xl lg:text-4xl font-bold text-white text-center lg:text-left mt-2 lg:mt-0">
            80% <br />{" "}
            <span className="text-base lg:text-2xl font-normal">
              {" "}
              increase in ROI{" "}
            </span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
