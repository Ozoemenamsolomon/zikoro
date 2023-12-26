"use client";
import { Checkbox } from "@/components/ui/checkbox";
// import { AddCircle } from "@styled-icons/fluentui-system-regular/AddCircle";
// import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import React from "react";

export const DiscountList: React.FC<{
  createdAt?: string;
  code?: string;
  bulk: string;
  validUntil?: string;
  amount?: string;
  percentage?: string;
  quantity?: string;
  status?: string;
}> = ({
  createdAt = "",
  code = "",
  bulk = "",
  validUntil = "",
  amount = "",
  percentage = "",
  quantity = "",
  status = "",
}) => {
  return (
    <ul className="grid grid-cols-8 place-items-center text-center p-3 text-[12px]">
      <li className="flex items-center">
        <Checkbox className=" data-[state=checked]:bg-purplebg data-[state=checked]:text-white" />
        <span>{createdAt}</span>
      </li>
      <li>{code}</li>
      <li>{bulk}</li>
      <li>{validUntil}</li>
      <li>{amount}</li>
      <li>{percentage}</li>
      <li>{quantity}</li>
      <li>
        <Switch className={`data-[state=checked]:bg-purplebg `} />
      </li>
    </ul>
  );
};
