"use client";
import React from "react";
import {
  AdminBlogPostIcon,
  AdminBlogShareIcon,
  AdminBlogViewIcon,
} from "@/constants";

export default function Create() {
  return (
    <div className=" h-screen px-10">
        {/* Header */}
      <div className="flex pt-28 pb-[44px] gap-x-10">
        <div className="flex py-6 px-[57px] gap-x-7 bg-white ">
          <AdminBlogPostIcon />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">32</p>
            <p className="text-base font-normal">Blog Posts</p>
          </div>
        </div>

        <div className="flex py-6 px-[57px] gap-x-7 bg-white ">
        <AdminBlogViewIcon />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">13.2K</p>
            <p className="text-base font-normal">Total Visits</p>
          </div>
        </div>

        <div className="flex py-6 px-[57px] gap-x-7 bg-white ">
          <AdminBlogShareIcon />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">50</p>
            <p className="text-base font-normal">Share</p>
          </div>
        </div>
      </div>
    </div>
  );
}
