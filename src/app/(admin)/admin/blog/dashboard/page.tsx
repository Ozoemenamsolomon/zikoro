"use client";
import React, { useState } from "react";
import {
  AdminBlogPostIcon,
  AdminBlogShareIcon,
  AdminBlogViewIcon,
  SearchIcon,
  AdminBlogCalendarIcon
} from "@/constants/icons";
import AdminPublishedBlog from "@/components/blog/AdminBlogTemplate";

export default function Create() {
  const [searchBox, setSearchBox] = useState("");

  const handleChange = (e: any) => {
    setSearchBox(e.target.value);
  };

  return (
    <div className=" pl-3 lg:pl-10 pr-3 lg:pr-28  ">
      {/* Header */}
      <div className="flex pt-28 pb-[44px] gap-x-10 overflow-x-auto lg:overflow-x-hidden no-scrollbar">
        <div className="flex py-6 px-[57px] gap-x-7 bg-white border-[1px] border-gray-200 rounded-lg ">
          <AdminBlogPostIcon />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">32</p>
            <p className="text-base font-normal">Blog Posts</p>
          </div>
        </div>

        <div className="flex py-6 px-[57px] gap-x-7 bg-white border-[1px] border-gray-200 rounded-lg ">
          <AdminBlogViewIcon />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">13.2K</p>
            <p className="text-base font-normal">Total Visits</p>
          </div>
        </div>

        <div className="flex py-6 px-[57px] gap-x-7 bg-white border-[1px] border-gray-200 rounded-lg ">
          <AdminBlogShareIcon />
          <div className="flex flex-col">
            <p className="text-2xl font-semibold">50</p>
            <p className="text-base font-normal">Share</p>
          </div>
        </div>
      </div>

      {/* Section1 */}
      <section className="mt-4 lg:mt-10 ">
        <p className="font-semibold text-2xl lg:text-3xl text-center lg:text-left gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end">Published Blog Post</p>
        <p className="font-normal text-sm lg:text-xl text-center lg:text-left mt-2">
          View all published blog posts, filter by name, date published and
          category{" "}
        </p>

        <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row justify-between mt-6">
          <div className=" p-1 border-[1px] border-indigo-600 rounded-xl w-full lg:w-[650px]  ">
            <div className="px-3 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl flex items-center h-[34px] ">
             <SearchIcon/>
              <input
                type="text"
                value={searchBox}
                name="searchBox"
                id=""
                onChange={handleChange}
                placeholder="search by blog post title"
                className="pl-4 outline-none text-base text-gray-600 bg-transparent h-full w-full"
              />
            </div>
          </div>
          
          <div className="flex p-[10px] gap-x-2 border-[1px] border-indigo-600 rounded-xl w-full lg:w-[180px] items-center justify-between h-[44px] ">
            <p>Date Published</p>
            <AdminBlogCalendarIcon/>
          </div> 

          <select
              name="industry"
              onChange={handleChange}
              value=""
              id=""
              className="w-full lg:w-[180px] h-[44px] bg-transparent rounded-lg border-[1px] text-base border-indigo-600 px-4 outline-none"
            >
              <option disabled selected value="" className="">
                Category
              </option>
              <option value="Conferences" className="bg-transparent text-black">
                Conferences
              </option>
            </select>

        </div>
      </section>

      {/* section 2 */}
      <section className="flex flex-col gap-y-[48px] lg:gap-y-[100px]  lg:max-w-[1160px] mx-auto mt-[52px] lg:mt-[100px] bg-white">
          <AdminPublishedBlog />
      </section>
    </div>
  );
}
