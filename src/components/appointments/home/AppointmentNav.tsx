import React from "react";
import Image from "next/image";
import { ChevronDown } from "styled-icons/bootstrap";

const AppointmentNav = () => {
  return (
    <div className="pt-6 hidden lg:block ">
      <div className=" bg-white flex items-center max-w-[1239px] py-6 px-[36px] rounded-[64px] justify-between mx-auto shadow ">
        {/* logo */}
        <Image src="/appointments/zikoroB.png" width={115} height={40} alt="" />

        {/* links */}
        <div className="flex gap-x-8 ">
          <p className="text-base font-medium cursor-pointer">
            Other Products <ChevronDown size={20} />
          </p>
          <p className="text-base font-medium cursor-pointer">Contact us</p>
        </div>

        {/* buttons */}
        <div className=" border-[1px] border-gray-200 rounded-[51px] flex gap-x-4 p-3 ">
          <button className="text-base px-[20px] py-[10px] text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end rounded-[28px]">
            Sign Up
          </button>
          <button className="text-base px-[20px] py-[10px] text-indigo-700 bg-transparent border border-indigo-800 rounded-[28px]">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentNav;
