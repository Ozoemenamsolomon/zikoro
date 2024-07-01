"use client";
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function LinkSharing() {
  const [isMonthly, setIsMonthly] = useState("");

  const handleToggle = () => {};

  return (
    <div className="mt-[60px] ml-0 lg:ml-[12px] mr-0 lg:mr-[47px] pl-3 lg:pl-[24px] pr-3 lg:pr-[114px]">
      <div className="">
        <p className="text-xl font-semibold"> Your workspace’s events </p>
        <p className="text-base font-normmal mt-4">
          All your events in one view. You can share a link of all your
          workspace events, or embed it on your website.
        </p>
      </div>

      <div className="mt-[60px]">
        <p className="text-lg font-medium">Workspace events page settings </p>

        <div className="mt-6 flex gap-x-3 items-center ">
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={!isMonthly}
            onCheckedChange={handleToggle}
          />

          <p className="text-base font-normal ">Show Categories</p>
        </div>

        <div className="mt-6 flex gap-x-3 items-center ">
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={!isMonthly}
            onCheckedChange={handleToggle}
          />

          <p className="text-base font-normal ">Turn off featured events</p>
        </div>

        <div className="mt-6 flex gap-x-3 items-center ">
          <Switch
            className="data-[state=checked]:bg-zikoroBlue"
            checked={!isMonthly}
            onCheckedChange={handleToggle}
          />

          <p className="text-base font-normal ">Turn off filters</p>
        </div>
      </div>
    </div>
  );
}
