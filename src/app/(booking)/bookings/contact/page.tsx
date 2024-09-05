"use client";
import React from "react";
import AppointmentNav from "@/components/appointments/home/AppointmentNav";
import AppointmentFooter from "@/components/appointments/home/AppointmentFooter";
import AppointmentContactForm from "@/components/appointments/contact/AppointmentContactForm";
import Image from "next/image";


const AppointmentContactPage = () => {
  return (
    <div className="">
      <div className="sticky top-10 z-10">
        <AppointmentNav />
      </div>
      <div className="mt-[140px] flex flex-col lg:flex-row gap-x-[60px] max-w-full lg:max-w-full 2xl:max-w-[97rem] mx-auto ">
        {/* left */}
        <div className="hidden lg:block w-1/2">
          <div className=" max-w-[383px] mx-auto ">
            <p className=" bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-[40px] font-extrabold leading-none">
              Send Us a message
            </p>
            <p className="text-xl text-[#1F1F1F] font-normal mt-[10px]">
              - Let's talk
            </p>
          </div>

          <Image
            src="/appointments/contactForm.webp"
            width={746}
            height={605}
            alt=""
            className="w-full h-[520px] xl:h-[605px]"
          />
        </div>
        {/* right */}
        <div className="w-full lg:w-1/2 px-3 lg:px-0">
          {/* Small and tablet Screens Only */}
          <div className="block lg:hidden">
            <p className=" bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-2xl font-extrabold text-center leading-none">
              Send Us a message
            </p>
            <p className="text-[12px]  text-[#1F1F1F] font-normal  mt-[10px] text-center ">
              Let's talk
            </p>
          </div>
          <AppointmentContactForm />
        </div>
      </div>
      <AppointmentFooter />
    </div>
  );
};

export default AppointmentContactPage;
