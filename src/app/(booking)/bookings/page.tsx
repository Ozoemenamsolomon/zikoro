"use client";
import React from "react";
import AppointmentNav from "@/components/appointments/home/AppointmentNav";
import AppointmentSec1 from "@/components/appointments/home/AppointmentSec1";
import AppointmentSec2 from "@/components/appointments/home/AppointmentSec2";
import AppointmentSec3 from "@/components/appointments/home/AppointmentSec3";
import AppointmentSec4 from "@/components/appointments/home/AppointmentSec4";
import AppointmentSec5 from "@/components/appointments/home/AppointmentSec5";
import AppointmentFooter from "@/components/appointments/home/AppointmentFooter";



const AppointmentHomePage = () => {
  return (
    <div className="bg-[#f9faff]">
      <div className="sticky top-4 z-10">
        <AppointmentNav />
      </div>
      <AppointmentSec1 />
      <AppointmentSec2 />
      <AppointmentSec3 />
      <AppointmentSec4 />
      <AppointmentSec5 />
      <AppointmentFooter/>
    </div>
  );
};

export default AppointmentHomePage;
