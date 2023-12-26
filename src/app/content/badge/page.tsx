"use client";
import React from "react";
import { Eye } from "styled-icons/evil";
import { Cog } from "@styled-icons/boxicons-regular/Cog";
import { Check } from "styled-icons/material";
import { Colorize } from "@styled-icons/material/Colorize";

const badges = [
  ["/badges/badge3.png", "/badges/badge2.png", "/badges/badge1.png"],
  ["/badges/badge4.png", "/badges/badge5.png", "/badges/badge6.png"],
];
export default function Badge() {
  return (
    <>
      <div className="flex justify-between items-center p-4">
        <h6 className="font-medium">Badge</h6>
        <div className="flex justify-between items-center space-x-6">
          <button className="flex justify-between items-center bg-purplebg text-white px-[12px] py-[8px] rounded-[5px]">
            <span className="pr-[8px]">Preview</span>
            <Eye size={20} />
          </button>
          <span>Color theme</span>
          <span className="bg-green-900 text-white py-2 px-3  rounded-md">
            <Check size={15} />
          </span>
          <button className="text-center">
            <span className="pr-[2px]">
              Saved <Check size={15} className="text-purplebg" />
            </span>
          </button>
          <Colorize size={20} />
          <Cog size={20} />
        </div>
      </div>
      <div className="flex justify-between my-4">
        {badges[0].map((badge, index) => {
          return (
            <img src={badge} key={index} width={300} height={150} alt="badge" />
          );
        })}
      </div>
      <div className="flex justify-between my-4">
        {badges[1].map((badge, index) => {
          return (
            <img src={badge} key={index} width={300} height={200} alt="badge" />
          );
        })}
      </div>
      <div className="mt-6">
        <p>Custom badge</p>
        <div className="bg-gray-300 w-[350px] flex gap-2 my-4 py-6 px-4">
          <div className="bg-white p-2 w-20 rounded-full">
            <img
              src="/badges/id-card.png"
              alt="id-card"
              width={100}
              height="auto"
            />
          </div>
          <p className="text-[12px]">
            <p>Upgrade your plan to use your own customized badge.</p>
            <div className="text-purplebg flex items-center space-x-2 mt-2">
              <span>Upgrade </span>
              <img
                src="/badges/icon-park_right.png"
                alt="right"
                width={20}
                height="auto"
              />
            </div>
          </p>
        </div>
      </div>
      <div className="flex mt-8 space-x-4 items-center">
        <button className="w-[10rem] bg-purplebg text-white px-[12px] py-[8px] rounded-[5px]">
          Save
        </button>
        <button className="border-2 border-purplebg w-[10rem] px-[12px] py-[6px] rounded-[5px] text-purplebg">
          Preview
        </button>
      </div>
    </>
  );
}
