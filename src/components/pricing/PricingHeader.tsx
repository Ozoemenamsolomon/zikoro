"use client";
import React from "react";

export default function PricingHeader() {
  return (
    <div className=" mt-40 lg:mt-48 px-5">
      <div className="max-w-4xl mx-auto">
        <p className=" text-3xl md:text-5xl  font-bold gradient-text bg-gradient-to-tr from-custom-gradient-start to-custom-gradient-end  text-center">
          {" "}
          Simple, straight-forward pricing
          <br className="hidden lg:block" /> that suits your needs
        </p>
        <p className="max-w-full lg:max-w-4xl mx-auto text-center  text-base lg:text-xl font-normal mt-5 lg:mt-10">
          Choose the best plan for your events. Whether you are just getting
          started, creating a one-off event, or personalizing every aspect of
          your event, there is a plan for you. 
        </p>
      </div>
    </div>
  );
}
