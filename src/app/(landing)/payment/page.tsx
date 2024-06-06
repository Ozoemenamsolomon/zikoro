"use client";
import React, { useState } from "react";

export default function PaymentPage({ payloads }: { payloads?: [] }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-gray-300  h-screen flex flex-col justify-center items-center px-3">
      <div className="py-20 lg:py-[151px] px-3 lg:px-6 shadow-sm rounded-[25px] bg-white max-w-full lg:max-w-[489px] w-full ">
        <p className="text-center text-2xl font-medium ">Order Summary</p>
        <div className="my-2 lg:my-5 p-8 border-[1px] border-indigo-500 rounded-lg">
          <p className="border-b-[1px] border-gray-300 pb-1 text-xl font-medium">
            Orders
          </p>
          {/* Quantities and prices */}
          <div className="mt-4 lg:mt-8 flex flex-col gap-y-4">
            <div className="flex justify-between text-base">
              <p className="">1x Subtotal</p>
              <p>₦ 240000</p>
            </div>
            <div className="flex justify-between text-base">
              <p className="">1x Discount</p>
              <p>₦ 240000</p>
            </div>
            <div className="flex justify-between text-base">
              <p className="">Total</p>
              <p>₦ 240000</p>
            </div>
          </div>

          <button className="text-base mt-6 lg:mt-12 text-white bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end  rounded-lg py-3 font-medium max-w-full lg:max-w-sm w-full ">
          Pay ₦ 180000
          </button>
        </div>
      </div>
    </div>
  );
}
