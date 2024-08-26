"use client";
import React from "react";
import Image from "next/image";

export default function AppointmentSec1() {
  return (
    <div className=" px-5 mt-[140px] relative max-w-full xl:max-w-7xl mx-0 xl:mx-auto">
      <Image
        src="/appointments/AppointmentCalendar.png"
        width={82}
        height={82}
        alt=""
        className="w-[82px] h-[82px] absolute top-[-84px] lg:right-[14rem] xl:right-[19rem]"
      />{" "}
      <Image
        src="/appointments/AppointmentCheck.png"
        width={122}
        height={92}
        alt=""
        className="w-[122px] h-[92px] absolute bottom-0 lg:right-16 xl:right-32"
      />{" "}
      <Image
        src="/appointments/AppointmentClock.png"
        width={138}
        height={138}
        alt=""
        className="w-[138px] h-[px] absolute bottom-0 lg:left-4 xl:left-16"
      />
      <div className="max-w-[1019px] mx-auto">
        <p className=" lg:text-[90px] xl:text-[90px] font-extrabold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end text-center leading-none">
          Effortless Bookings, <span className="">Happier Clients</span>
        </p>
        <p className="max-w-full lg:max-w-[698px] mx-auto text-center text-base font-normal mt-5 lg:mt-10">
          With our comprehensive{" "}
          <span className="font-medium">booking software, </span>you can{" "}
          <span className="font-medium"> simplify </span> your appointments,{" "}
          <span className="font-medium">improve </span>
          client interactions, and run an{" "}
          <span className="font-medium"> efficient</span> business. Whether
          you're a <span className="font-medium">freelancer,</span> small{" "}
          <span className="font-medium">business owner, </span> or a{" "}
          <span className="font-medium">large enterprise, </span>
          Zikoro Bookings has the features you need to manage your appointments
          effortlessly... 
        </p>
      </div>
    </div>
  );
}
