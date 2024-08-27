"use client";
import React from "react";
import Image from "next/image";
import { CrossedEye, GoogleBlackIcon, OrIcon } from "@/constants";
import { useRouter } from "next/navigation";

const AppointmentLoginForm = () => {
  const router = useRouter();

  return (
    <div className="bg-white py-[20px] px-[42px] rounded-[8px] max-w-full lg:max-w-[542px] ">
      <div className="flex justify-center ">
        <Image
          src="/appointments/logoFooter.png"
          width={115}
          height={40}
          alt=""
          className="w-[115px] h-[40px]"
        />
      </div>

      <p className="text-2xl text-indigo-600 text-center mt-5 font-semibold">
        Welcome Back
      </p>
      <p className="mt-4 font-normal text-center">
        Time to Take Control –{" "}
        <span className="block"> Log In and Get Your Schedule Sorted! </span>
      </p>

      <form action="" className="mt-5">
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
          <label htmlFor="">Password</label>
          <div className="flex items-center justify-around border-[1px] border-gray-200 rounded-[6px] ">
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="w-[90%] px-[10px] py-4 h-full text-base  outline-none"
            />
            <CrossedEye />
          </div>
          <p className="text-blue-500 text-right cursor-pointer">
            Forgot password?
          </p>
        </div>

        <button
          type="submit"
          className="py-4 px-3 text-base w-full rounded-[8px] font-semibold mt-10 mb-6 text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end"
        >
          Get Started
        </button>
      </form>
      <OrIcon />

      <button className="py-4 px-3 flex items-center justify-center gap-x-2 text-base w-full rounded-[8px] mt-10 mb-6  border-[1px] border-gray-200">
        <GoogleBlackIcon /> Sign Up with google
      </button>

      <p className="mt-[14px] text-center">
        Don't have an account?{" "}
        <span
          className="text-indigo-400 cursor-pointer"
          onClick={() => router.push("/bookings/signup")}
        >
          Signup
        </span>
      </p>
    </div>
  );
};

export default AppointmentLoginForm;
