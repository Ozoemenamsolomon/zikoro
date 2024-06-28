"use client";
import React from "react";
import { TeamIcon } from "@/constants";
import { SearchAlt2 } from "styled-icons/boxicons-regular";

export default function Team() {
  return (
    <div className="mt-[60px] ml-0 lg:ml-[12px] mr-0 lg:mr-[47px] pl-3 lg:pl-[24px] pr-3 lg:pr-[114px]">
      <div className="flex items-center gap-x-3">
        <TeamIcon />
        <p className="text-xl font-semibold"> Team Members</p>
      </div>

      <div className="">
        <div className="mt-[52px] border-[1px] border-indigo-600 rounded-md flex justify-between ">
          {/* search */}
          <div className="px-[14px] py-[12px] flex gap-x-3 items-center w-full lg:w-1/3 ">
            <SearchAlt2 size={16} className="text-indigo-500" />
            <input
              type="text"
              id=""
              className=" w-full border-0 outline-none h-full placeholder-black"
              placeholder=" Search..."
            />
          </div>
          {/* Invite team members */}
          <div className="bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end">
            
          </div>
        </div>

        <div>
          <table></table>
        </div>
      </div>
    </div>
  );
}
