"use client";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Usd } from "styled-icons/fa-solid";

export default function PricingCurrency() {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");

  //currencies list
  const currencies = ["USD", "NGN", "GHC", "ZAR", "KES"];

  //toggler functions
  const handlePlanToogle = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className=" mt-12 lg:mt-20 px-5 lg:px-0 max-w-full lg:max-w-7xl mx-auto justify-between items-center flex flex-col md:flex-row gap-y-6 ">
      <div className="px-3 rounded-lg border-[1px]  border-indigo-600 ">
        <select
          name="currency"
          value={selectedCurrency}
          className="bg-transparent  h-[45px] outline-none cursor-pointer "
          onChange={(e) => setSelectedCurrency(e.target.value)}
        >
          <option value="" selected disabled>
            Currency
          </option>
          {currencies.map((currency, index) => (
            <option value={currency} key={index}>
              {currency}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center md:flex-row gap-y-2 gap-x-6 ">
        <p className="text-xl font-medium ">Monthly</p>
        <Switch
          className="data-[state=checked]:bg-zikoroBlue"
          checked={isChecked}
          onCheckedChange={(e) => setIsChecked(!isChecked)}
        />
        <p className="text-xl font-medium">Yearly</p>

        <div className="relative text-[11px] lg:text-[14px] bg-zikoroBlue py-2 px-2 lg:px-2 text-white ml-2">
          save up to 35%
          <div className="absolute left-0 top-0 bottom-0 w-[16px] bg-zikoroBlue transform -translate-x-full clip-triangle"></div>
        </div>
      </div>
    </div>
  );
}
