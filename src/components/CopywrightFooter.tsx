"use client";
import React from "react";


export default function CopywrightFooter() {
  return (
    <div className="mt-10">
      <div className="mt-4 lg:mt-6 border-t-[1px] border-indigo-500 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end  px-5 lg:px-0">
        <div className="max-w-6xl  mx-auto py-4 lg:py-14 flex justify-between">
          <p className="text-[13px] lg:text-base font-normal">
            {" "}
            <span className="hidden lg:inline">Copyright</span> © 2024 - Zikoro{" "}
            <span className="hidden lg:inline"> - an OrthoEx brand</span>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
