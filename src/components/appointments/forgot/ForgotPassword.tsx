"use client";
import React, { useState } from "react";
import { useForgotPassword } from "@/hooks";
import { LoaderAlt } from "styled-icons/boxicons-regular";
import { montserrat } from "@/utils/fonts";

const ForgotPasswordComponent = () => {
  const { loading, forgotPassword } = useForgotPassword();

  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await forgotPassword(email);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-full lg:max-w-2xl xl:max-w-3xl px-3 lg:px-0"
    >
      <p className="font-medium text-lg sm:text-xl text-center ">
        Forgot Password
      </p>
      <p className="mt-2 text-center font-light">
        Enter the email you used for registration.
      </p>
      <div className="mt-6">
        <div className="w-full p-1 border-[1px] border-indigo-800 rounded-xl h-[52px]  ">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="pl-4 outline-none text-xs text-gray-600 bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end rounded-xl w-full h-full"
          />
        </div>

        <button
          type="submit"
          className={`text-white ${montserrat.className} text-base bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end py-4 w-full rounded-lg mt-4`}
        >
          {loading && <LoaderAlt size={22} className="animate-spin" />}
          Submit{" "}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordComponent;
