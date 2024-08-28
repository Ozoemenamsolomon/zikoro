"use client";
import React from "react";
import AppointmentLoginForm from "@/components/appointments/login/AppointmentLoginForm";

const AppointmentLoginPage = () => {
  return (
    <div className="bg-[url('/appointments/bgImg.webp')] bg-cover bg-center bg-no-repeat h-screen flex items-center justify-center ">
      <AppointmentLoginForm />
    </div>
  );
};

export default AppointmentLoginPage;
