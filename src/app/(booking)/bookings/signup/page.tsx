"use client";
import React from "react";
import AppointmentSignupForm from "@/components/appointments/signup/AppointmentSignupForm";

const AppointmentSignupPage = () => {
  return (
    <div className="flex items-center lg:items-start  bg-white w-full h-screen lg:justify-between justify-center lg:bg-[url('/appointments/bgImg.webp')] lg:bg-cover lg:bg-center lg:bg-no-repeat lg:h-fit 2xl:h-screen py-1 px-3 lg:py-[50px] lg:px-[50px] xl:p-[91px] max-w-full xl:max-w-[97rem]  mx-auto">
      <div className="mt-[34px] hidden lg:block">
        <p className=" bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-[32px] font-extrabold leading-none">
          Get started with{" "}
          <span className="leading-none text-[40px] inline lg:block">
            Zikoro Bookings
          </span>{" "}
        </p>
        <p className="text-base p-2 text-white bg-blue-500 font-medium opacity-50 mt-[10px] rounded-[8px]">
          Simplify Scheduling for a Seamless Client Experience.
        </p>
      </div>
      <div>
        <AppointmentSignupForm />
      </div>
    </div>
  );
};

export default AppointmentSignupPage;
