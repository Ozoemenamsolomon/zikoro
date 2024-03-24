"use client";
import React, { useState } from "react";
import Image from "next/image";
import { LocationIcon1, LocationIcon2 } from "../svg/Constants";

export default function EventHeader() {
  const [searchBox, setSearchBox] = useState("");

  const handleChange = (e: any) => {
    setSearchBox(e.target.value);
  };
  return (
    <div className="bg-gradient-overlay relative">
      <Image
        src="/eventsBg.png"
        alt="Background"
        width={1440}
        height={600}
        className="object-cover w-full h-[700px] hidden lg:block"
      />
      <Image
        src="/eventsBg.png"
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

          <div className=" h-4 absolute   bottom-0 left-0 right-0 flex items-center justify-center  ">
            {/* Big Form */}
            <form
              action=""
              className="hidden lg:block px-12 py-10 pt-12 w-[1055px] h-[210px] bg-white rounded-lg shadow-md"
            >
              <p className="text-2xl font-normal">Find Events Easily</p>

              <div className="pt-7 h-9 mt-6 flex items-center w-full gap-x-4">
                {/* <div className="flex flex-2 gap-x-2 px-10 py-[6px] rounded-md">
                  <LocationIcon1 />
                  <p className="text-base text-semibold">Lagos</p>
                </div> */}

                <div className="h-[48px] flex justify-between gap-x-3 flex-1 items-center">
                  <div className=" p-1 border-[1px] border-indigo-800 rounded-xl w-full h-full">
                    <input
                      type="text"
                      value={searchBox}
                      name="searchBox"
                      id=""
                      onChange={handleChange}
                      placeholder="search by event name, city, category"
                      className="pl-4 outline-none text-base text-gray-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl w-full h-full"
                    />
                  </div>

                  <button className="bg-gradient-to-tr flex-1 from-custom-gradient-start to-custom-gradient-end text-white cursor-pointer px-5 text-base py-[13px] rounded-lg">
                    {" "}
                    Search
                  </button>
                </div>
              </div>
            </form>

            {/* Small Form */}
            <form
              action=""
              className="block lg:hidden px-[10px]  pt-5 w-11/12 h-[150px] bg-white rounded-lg shadow-md"
            >
              <p className="text-[20px] font-normal">Find Events Easily</p>

              <div className="h-[58px] pt-[15px] flex justify-between gap-x-3 items-center">
                <div className=" p-1 border-[1px] border-indigo-800 rounded-xl w-full h-full">
                  <input
                    type="text"
                    value={searchBox}
                    name="searchBox"
                    id=""
                    onChange={handleChange}
                    placeholder="Search by event name, city, category"
                    className="pl-4 outline-none text-xs text-gray-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl w-full h-full"
                  />
                </div>

                <button className="   bg-gradient-to-tr flex from-custom-gradient-start to-custom-gradient-end text-white cursor-pointer text-base px-5 py-[10px] rounded-lg mx-auto">
                  {" "}
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
