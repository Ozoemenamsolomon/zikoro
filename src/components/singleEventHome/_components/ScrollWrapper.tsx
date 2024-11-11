"use client";

import { ScrollableCards } from "@/components/custom_ui/scrollableCard/ScrollableCard";
import { cn } from "@/lib";
import React from "react";
export function ScrollWrapper({
  header,
  onclick,
  children,
  parentClassName,
  hideSeeAll
}: {
  header: string;
  onclick: () => void;
  children: React.ReactNode;
  parentClassName?:string;
  hideSeeAll?:boolean;
}) {
  return (
    <div className="w-full hidden h-full sm:flex flex-col items-start justify-start gap-6">
      <div className="w-full flex items-center justify-between">
        <h2 className="font-semibold text-desktop sm:text-lg">{header}</h2>
        <button
          onClick={onclick}
          className={cn("text-mobile sm:text-sm gradient-text bg-basePrimary font-medium", hideSeeAll && "hidden")}
        >
          See All
        </button>
      </div>
      <ScrollableCards
        parentClassName={parentClassName || "bg-white  h-full py-10 rounded-lg px-6"}
        className="items-center justify-center"
      >
        {children}
      </ScrollableCards>
    </div>
  );
}
