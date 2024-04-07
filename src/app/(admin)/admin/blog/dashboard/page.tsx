"use client";
import React, { useState } from "react";
import {
  AdminBlogPostIcon,
  AdminBlogShareIcon,
  AdminBlogViewIcon,
  ArrowDownIcon,
  Calendar,
  SearchIcon,
} from "@/constants/icons";
import AdminPublishedBlog from "@/components/blog/AdminPublishedBlog";

export default function Create() {
  const [searchBox, setSearchBox] = useState("");

  const handleChange = (e: any) => {
    setSearchBox(e.target.value);
  };

  return (
    <div className=" pl-3 lg:pl-10 pr-3 lg:pr-28 ">
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

      {/* Section1 */}
      <section className="mt-10 ">
        <p className="font-semibold text-3xl gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end">Published Blog Post</p>
        <p className="font-normal text-xl mt-2">
          View all published blog posts, filter by name, date published and
          category{" "}
        </p>

        <div className="flex justify-between h-[44px] mt-6">
          <div className=" p-1 border-[1px] border-indigo-600 rounded-xl w-[650px]  ">
            <div className="px-3 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end h-full rounded-xl flex items-center ">
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
          
          <div className="flex p-[10px] gap-x-2 border-[1px] border-indigo-600 rounded-xl w-[180px] items-center justify-between ">
            <p>Date Published</p>
            <Calendar/>
          </div>

          <div className=" flex p-[10px] gap-x-2 border-[1px] border-indigo-600 rounded-xl w-[180px] items-center justify-between">
            <p>Blog Category</p>
            <ArrowDownIcon/>
          </div>
        </div>
      </section>

      {/* section 2 */}
      <section className="flex flex-col gap-y-[48px] lg:gap-y-[100px]  lg:max-w-[1160px] mx-auto mt-[52px] lg:mt-[100px] bg-white">
          <AdminPublishedBlog/>
          <AdminPublishedBlog/>
          <AdminPublishedBlog/>
      </section>
    </div>
  );
}
