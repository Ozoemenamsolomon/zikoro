"use client";
import React, { useState } from "react";
import Image from "next/image";

interface SearchComponentProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<string>; //Assuming setSearchQuery is a dispatcher for strings
}

export default function EventHeader({
  searchQuery,
  setSearchQuery,
}: SearchComponentProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="bg-gradient-overlay relative">
      <Image
        src="/eventsBg.webp"
        alt="Background"
        width={1440}
        height={600}
        className="object-cover w-full h-[700px] hidden lg:block"
      />
      <Image
        src="/eventsBg.webp"
        alt="Background"
        width={350}
        height={366}
        className="object-cover block h-[400px] w-full  lg:hidden"
      />
      <div className="absolute inset-0 flex items-center justify-center ">
        <div className="flex flex-col justify-between ">
          <p className="text-3xl lg:text-5xl text-white font-bold">
            Explore A Wide{" "}
            <span className="block lg:inline">Range Of Events</span>
          </p>

          <div className=" h-4 absolute  bottom-0 left-0 right-0 flex items-center justify-center  ">
            {/* Big Form */}
            <form
              action=""
              className="hidden lg:block px-12 py-10 pt-12 w-[1055px] h-[210px] bg-white rounded-lg shadow-md"
            >
              <p className="text-2xl font-normal">Find Events Easily</p>

              <div className="pt-7 h-9 mt-6 flex items-center w-full gap-x-4">
                <div className="h-[48px] flex flex-1">
                  <div className=" p-1 border-[1px] border-indigo-800 rounded-xl w-full h-full">
                    <input
                      type="text"
                      value={searchQuery}
                      name="searchBox"
                      id=""
                      onChange={handleChange}
                      placeholder="search by event name, city, category"
                      className="pl-4 outline-none text-base text-gray-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Small Form */}
            <form
              action=""
              className="block lg:hidden px-[10px]  pt-5 w-11/12 h-[150px] bg-white rounded-lg shadow-md"
            >
              <p className="text-[20px] font-normal">Find Events Easily</p>

              <div className="h-[58px] pt-[15px] items-center">
                <div className=" p-1 border-[1px] border-indigo-800 rounded-xl w-full h-full">
                  <input
                    type="text"
                    value={searchQuery}
                    name="searchBox"
                    id=""
                    onChange={handleChange}
                    placeholder="Search by event name, city, category"
                    className="pl-4 outline-none text-xs text-gray-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl w-full h-full"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
