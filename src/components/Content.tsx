"use client";

import { Eye } from "styled-icons/evil";
import { UploadOutline } from "styled-icons/evaicons-outline";
import { Check } from "styled-icons/material";
import { AddToQueue } from "@styled-icons/boxicons-regular/AddToQueue";
import { Trash } from "@styled-icons/boxicons-regular/Trash";
import Link from "next/link";
// import { useState } from "react";

export default function Content() {
  // const [data, setData] = useState({
  //   name: "",
  //   description: "",
  //   price: 0,
  // })
  return (
    <div className="w-[100%] h-[100%] bg-[#FFFFFF]">
      <main className="">
        {/* header */}
        <div className="h-[120px] text-2xl ">Content</div>
        {/* sub-header */}
        <div className="p-4 text-base flex items-center justify-between text-black ">
          <div>
            <ul className="flex items-center justify-center space-x-8 text-[#717171]">
              <li>
                <Link href={"#"}>Home</Link>
              </li>
              <li>
                <Link href={"#"}>Contact</Link>
              </li>
              <li>
                <Link href={"#"}>Certificate</Link>
              </li>
              <li>
                <Link href={"#"}>Badge</Link>
              </li>
              <li>
                <Link href={"#"}>Discount</Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center space-x-6">
            <div className="space-x-4 flex items-center justify-center">
              <button className="flex justify-center items-center bg-[#FF863D] text-white px-[12px] py-[8px] rounded-[5px]">
                <span className="mr-2">Preview</span>
                <Eye size={25} />
              </button>
              <button className="flex justify-center items-center text-[#FF863D] border-2 border-orange-500 px-[12px] py-[8px] rounded-[5px]">
                <span className="mr-2">Publish</span>
                <UploadOutline size={25} />
              </button>
            </div>
            <div className="flex justify-center items-center space-x-4 text-[#717171]">
              <button className="text-center">
                <span className="pr-[2px]">Saved</span>
                <Check size={20} color="#FF863D" />
              </button>
              <button className="text-[#FF863D]">
                <AddToQueue size={20} />
                <span className="ml-[4px]">Duplicate</span>
              </button>
              <button className="text-red-500">
                <Trash size={20} style={{ marginRight: "4px" }} />
                <span>Delete </span>
              </button>
            </div>
          </div>
        </div>
        {/* main content */}
        <div className="my-6 mx-12 border-2 rounded-md border-[#f3f3f3]">
          <div className="p-4">
            <h6 className="text-bold">Event information</h6>
          </div>
          {/* form */}
          <form className="w-[100%] ">
            <div className="grid grid-cols-2">
              <div className="p-4 space-y-6">
                <div className="w-100">
                  <label
                    htmlFor="eventName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Event Title
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="eventName"
                      id="eventName"
                      className="p-5 w-[100%] rounded-md border-2 border-[#f3f3f3] shadow-sm sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex space-x-4">
                  <div className="">
                    <label
                      htmlFor="eventName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start date & time
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="eventName"
                        id="eventName"
                        placeholder="Pick a date & time"
                        className="p-5 rounded-md border-2 border-[#f3f3f3] shadow-sm  sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="">
                    <label
                      htmlFor="eventDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End date & time
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        name="eventDate"
                        id="eventDate"
                        placeholder="Pick a date & time"
                        className="p-5 rounded-md border-2 border-[#f3f3f3] shadow-sm  sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Event category
                  </p>
                  <div className=" p-4 rounded-md border-2 border-[#f3f3f3] shadow-sm ">
                    <select
                      className="w-full bg-white border-0 sm:text-sm focus:border-0 outline-0"
                      placeholder="Please select"
                    >
                      <option value="onsite">Onsite</option>
                      <option value="online">Online</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
                <div className="">
                  <label
                    htmlFor="NumberOfParticipants"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Number of participants
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="NumberOfParticipants"
                      placeholder="0"
                      className="p-5 rounded-md border-2 border-[#f3f3f3] shadow-sm  sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
