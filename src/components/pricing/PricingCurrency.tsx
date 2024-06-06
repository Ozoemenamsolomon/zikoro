"use client";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function PricingCurrency() {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  //currencies list
  const currencies = [
    {
      name: "USD",
      symbol: "$",
    },
    {
      name: "EUR",
      symbol: "€",
    },
    {
      name: "GBP",
      symbol: "£",
    },
    {
      name: "JPY",
      symbol: "¥",
    },
    {
      name: "AUD",
      symbol: "A$",
    },
    {
      name: "CAD",
      symbol: "C$",
    },
    {
      name: "CNY",
      symbol: "¥",
    },
    {
      name: "INR",
      symbol: "₹",
    },
    {
      name: "NGN",
      symbol: "₦",
    },
    {
      name: "EGP",
      symbol: "£",
    },
    {
      name: "DZD",
      symbol: "د.ج",
    },
    {
      name: "GHS",
      symbol: "GH₵",
    },
  ];

  //toggler functions
  const handlePlanToogle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className=" mt-12 lg:mt-20 px-5 lg:px-0 max-w-full lg:max-w-7xl mx-auto justify-between items-center flex flex-col lg:flex-row gap-y-4 ">
      <select
        name="currency"
        id=""
        className="border-[1px] border-indigo-600 rounded-lg h-[45px] outline-none"
      >
        <option value="currency" selected disabled>
          Select Currency
        </option>
        {currencies.map((currency, index) => (
          <option value={currency.name} key={index}>
            {currency.symbol}
          </option>
        ))}
      </select>

      <div className="flex items-center  gap-x-3 ">
        <p className="text-xl font-medium ">Monthly</p>
        <Switch
          className={`${isChecked ? "bg-zikoroBlue" : "bg-white"}`}
          checked={isChecked}
          onChange={() => handlePlanToogle()}
        />
        <p className="text-xl font-medium">Yearly</p>

        <div className="text-[11px] lg:text-[14px] bg-zikoroBlue py-2 px-2 lg:px-4 text-white ">
          {" "}
          save up to 35%
        </div>
      </div>
    </div>
  );
}
