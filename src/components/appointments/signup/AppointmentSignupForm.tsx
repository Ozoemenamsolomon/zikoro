"use client";
import React, { useState } from "react";
import Image from "next/image";
import { CrossedEye, GoogleBlackIcon, OrIcon } from "@/constants";
import { useRouter } from "next/navigation";
import { useRegistration } from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";

const AppointmentSignupForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const { loading, register } = useRegistration();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function onSubmit(e: any) {
    e.preventDefault();
    await register(formData);
  }

  return (
    <div className="bg-white py-0 lg:py-[37px] px-3 lg:px-[42px] rounded-[8px] max-w-full lg:max-w-[542px] ">
      <div className="flex justify-center ">
        <Image
          src="/appointments/logoFooter.png"
          width={115}
          height={40}
          alt=""
          className="w-[115px] h-[40px]"
        />
      </div>

      <p className="text-2xl text-indigo-600 text-center mt-10 font-semibold">
        Sign Up
      </p>
      <p className="mt-4 font-normal text-center lg:text-left">
        It’ll Only Take 2 Minutes to Get You Up and Running!
      </p>

      <form action="" className="mt-10" onSubmit={onSubmit}>
        <div className="flex flex-col gap-y-3 ">
          <label htmlFor="">First Name</label>
          <input
            type="text"
            name="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter First Name"
            className="border-[1px] border-gray-200 px-[10px] py-4 w-full text-base rounded-[6px] outline-none"
          />
        </div>
        <div className="flex flex-col gap-y-3 mt-6 ">
          <label htmlFor="">Last Name</label>
          <input
            type="text"
            name="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter Last Name"
            className="border-[1px] border-gray-200 px-[10px] py-4 w-full text-base rounded-[6px] outline-none"
          />
        </div>
        <div className="flex flex-col gap-y-3 mt-6">
          <label htmlFor="">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email Address"
            className="border-[1px] border-gray-200 px-[10px] py-4 w-full text-base rounded-[6px] outline-none"
          />
        </div>

        <div className="flex flex-col gap-y-3 mt-6">
          <label htmlFor="">Password</label>
          <div className="flex items-center justify-around border-[1px] border-gray-200 rounded-[6px] ">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-[90%] px-[10px] py-4 h-full text-base  outline-none"
              minLength={8}
            />
            <div onClick={() => setShowPassword(!showPassword)}>
              <CrossedEye />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="py-4 px-3 text-base w-full rounded-[8px] font-semibold mt-10 mb-6 text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end"
        >
          {loading && <LoaderAlt size={22} className="animate-spin" />}
          Get Started
        </button>
      </form>
      <div className="max-[400px]:hidden ">
        <OrIcon />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="py-4 px-3 flex items-center justify-center gap-x-2 text-base w-full rounded-[8px] mt-10 mb-6  border-[1px] border-gray-200"
      >
        <GoogleBlackIcon /> Sign Up with google
      </button>

      <p className="mt-[14px] text-center">
        Already have an account?{" "}
        <span
          className="text-indigo-400 cursor-pointer"
          onClick={() => router.push("/bookings/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default AppointmentSignupForm;
