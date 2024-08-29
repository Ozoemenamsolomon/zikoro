"use client";
import React from "react";
import AppointmentLoginForm from "@/components/appointments/login/AppointmentLoginForm";

const AppointmentLoginPage = () => {
  return (
    <div className="items-center justify-center bg-white flex w-full h-screen lg:bg-[url('/appointments/bgImg.webp')] lg:bg-cover lg:bg-center lg:bg-no-repeat">
      <AppointmentLoginForm />
    </div>
  );
};

export default AppointmentLoginPage;
