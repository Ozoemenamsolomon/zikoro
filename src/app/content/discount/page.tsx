"use client";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { AddCircle } from "@styled-icons/fluentui-system-regular/AddCircle";
import { Separator } from "@/components/ui/separator";
import { DiscountList } from "@/components/Discount/DiscountList";

export default function Discount() {
  return (
    <div className="p-4">
      <div className="flex justify-between my-5">
        <h6 className="font-medium">Discount</h6>
        <button className="flex justify-between items-center bg-purplebg text-white px-[12px] py-[8px] rounded-[5px]">
          <span className="pr-[8px]">New</span>
          <AddCircle size={20} />
        </button>
      </div>
      <div className="p-3 ">
        <ul className="grid grid-cols-8 place-items-center text-center border bg-[#f3f3f3] p-3 border-b-2 text-[14px] font-bold">
          <li>Created at</li>
          <li>Code</li>
          <li>Min Qty</li>
          <li>Valid until</li>
          <li>Amount</li>
          <li>Percentage</li>
          <li>Quantity</li>
          <li>Status</li>
        </ul>

        <DiscountList
          createdAt="2023-12-01"
          code="t555"
          minQty="1"
          validUntil="2023-12-12"
          amount="5000"
          percentage="NULL"
          quantity="1"
          status="checked"
        />
        <Separator />
        <DiscountList
          createdAt="2023-12-01"
          code="t555"
          minQty="1"
          validUntil="2023-12-12"
          amount="5000"
          percentage="NULL"
          quantity="1"
          status="checked"
        />
        <Separator />
        <DiscountList
          createdAt="2023-12-01"
          code="t555"
          minQty="1"
          validUntil="2023-12-12"
          amount="5000"
          percentage="NULL"
          quantity="1"
          status="checked"
        />
        <Separator />
        <DiscountList
          createdAt="2023-12-01"
          code="t555"
          minQty="1"
          validUntil="2023-12-12"
          amount="5000"
          percentage="NULL"
          quantity="1"
          status="checked"
        />
        <Separator />
        <DiscountList
          createdAt="2023-12-01"
          code="t555"
          minQty="1"
          validUntil="2023-12-12"
          amount="5000"
          percentage="NULL"
          quantity="1"
          status="checked"
        />
        <Separator />
        <DiscountList
          createdAt="2023-12-01"
          code="t555"
          minQty="1"
          validUntil="2023-12-12"
          amount="5000"
          percentage="NULL"
          quantity="1"
          status="checked"
        />
        <Separator />
      </div>
    </div>
  );
}
