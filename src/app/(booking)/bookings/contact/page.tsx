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
      <div className="mt-[140px] flex gap-x-[60px]">
        {/* left */}
        <div className="hidden lg:block w-1/2">
          <div className=" max-w-[383px] mx-auto ">
            <p className=" bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end gradient-text text-[40px] font-extrabold leading-none">
              Send Us a message
            </p>
            <p className="text-xl p-2 text-blackfont-medium opacity-50 mt-[10px] rounded-[8px]">
              - Let's talk
            </p>
          </div>

          <Image
            src="/appointments/contactForm.webp"
            width={746}
            height={605}
            alt=""
            className="w-full h-[605px]"
          />
        </div>
        {/* right */}
        <div className="w-1/2">
          <AppointmentContactForm />
        </div>
      </div>
      <AppointmentFooter />
    </div>
  );
};

export default AppointmentContactPage;
