"use client";
import React from "react";

const AppointmentContactForm = () => {
  return (
    <div className="bg-white rounded-[8px] max-w-full lg:max-w-[522px] ">
      <form action="" className="mt-10">
        <div className="flex flex-col gap-y-3 ">
          <label htmlFor="">First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter First Name"
            className="border-[1px] border-gray-200 px-[10px] py-4 w-full text-base rounded-[6px] outline-none"
          />
        </div>
        <div className="flex flex-col gap-y-3 mt-6 ">
          <label htmlFor="">Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter Last Name"
            className="border-[1px] border-gray-200 px-[10px] py-4 w-full text-base rounded-[6px] outline-none"
          />
        </div>
        <div className="flex flex-col gap-y-3 mt-6">
          <label htmlFor="">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email Address"
            className="border-[1px] border-gray-200 px-[10px] py-4 w-full text-base rounded-[6px] outline-none"
          />
        </div>
        <div className="flex flex-col gap-y-3 mt-6">
          <label htmlFor="">Message</label>
          <textarea
            name=""
            id=""
            cols={30}
            rows={10}
            className="border-[1px] border-gray-200 px-[10px] py-4 text-base rounded-[6px] h-full outline-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="py-4 px-3 text-base w-full rounded-[8px] font-semibold mt-10 mb-6 text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end"
        >
          Get Started
        </button>
      </form>
    </div>
  );
};

export default AppointmentContactForm;
