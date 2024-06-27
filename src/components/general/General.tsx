"use client";
import { GeometryIcon } from "@/constants";
import React from "react";

export default function General() {
  return (
    <div className="">
      {/* Settings sections */}
      <div className="mt-[68px] ml-[12px] mr-[47px] pl-[24px] pr-[114px] ">
        <div className="flex items-center gap-x-3 pt-[32px] ">
          <GeometryIcon />
          <p className="text-xl font-semibold">Basic Settings</p>
        </div>

        <div className="mt-8">
          <p className="text-[14px] text-[#1f1f1f]">Workspace Name</p>
          <div className="w-full h-[45px] mt-2 ">
            <input
              required
              type="text"
              value="Techies"
              name=""
              className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f]"
            />
          </div>
          <p className="mt-2 text-[12px] text-[#1f1f1f]">
            Events are created inside this workspace. Pick a name that best
            represents these events.
          </p>
        </div>

        <div className="mt-8">
          <p className="text-[14px] text-[#1f1f1f]">Oragnisation Name</p>
          <div className="w-full h-[45px] mt-2 ">
            <input
              required
              type="text"
              value="Oragnisation Name"
              name=""
              className="w-full h-full rounded-xl border-[1px] border-indigo-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end pl-3 outline-none text-[15px] text-[#1f1f1f]"
            />
          </div>
        </div>
      </div>
      {/* Delete Section */}
    </div>
  );
}
