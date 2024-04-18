"use client";
import React, { useState } from "react";
import { AdminBlogCalendarIcon } from "@/constants/icons";
import AdminPublishedBlog from "@/components/blog/AdminBlogTemplate";

export default function Create() {
  const [searchBox, setSearchBox] = useState("");

  const handleChange = (e: any) => {
    setSearchBox(e.target.value);
  };

  return (
    <div className=" pl-3 lg:pl-10 pr-3 lg:pr-28 pt-16 lg:pt-20  ">
      {/* Section1 */}
      <section className="">
        <div className="flex flex-col gap-y-4 lg:gap-y-0 lg:flex-row gap-x-0 md:gap-x-6 mt-6">
          <div className="flex p-[10px] gap-x-2 border-[1px] border-indigo-600 rounded-xl w-full lg:w-[180px] items-center justify-between h-[44px] ">
            <p>Date Published</p>
            <AdminBlogCalendarIcon />
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
      <section className="flex flex-col gap-y-[48px] lg:gap-y-[100px]  lg:max-w-[1160px] mx-auto mt-[20px] lg:mt-[24px] bg-white">
        <AdminPublishedBlog draft={true} />
      </section>
    </div>
  );
}
