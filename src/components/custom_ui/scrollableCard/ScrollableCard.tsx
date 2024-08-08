"use client";

import React, { useRef } from "react";

import { cn } from "@/lib";
import { useScrollCard } from "@/hooks";
import { NavigateBefore, NavigateNext } from "styled-icons/material";

export function ScrollableCards({ children }: { children: React.ReactNode }) {
  const scroll = useRef<HTMLDivElement>(null);
  const { next, previous, isPrevious, isNext } = useScrollCard(scroll);
  return (
    <div className="relative w-full overflow-x-hidden">
      <button
        type="button"
        className={cn(
          "hidden",
          isPrevious &&
            "absolute left-[15px] top-[45%] z-[20] hidden h-8 w-8 text-center  cursor-pointer select-none rounded-full bg-white p-1 text-[#1aa3a1] transition-all duration-700 ease-in sm:block"
        )}
        onClick={previous}
      >
        <NavigateBefore size={22} className="mx-auto text-center" />
      </button>
      <button
        type="button"
        className={cn(
          "hidden",
          isNext &&
            "absolute right-[7px] top-[45%] z-[20] hidden h-8 w-8 text-center cursor-pointer select-none rounded-full bg-white p-1 text-[#1aa3a1] transition-all duration-700 ease-in sm:block"
        )}
        onClick={next}
      >
        <NavigateNext size={22} className="mx-auto text-center" />
      </button>
      <div
        ref={scroll}
        className="no-scrollbar flex w-[105%] gap-4 overflow-x-auto pl-[0em] pr-[4em] sm:pl-[1em]"
      >
        <div className="flex min-w-max gap-2 sm:gap-4 ">{children}</div>
      </div>
    </div>
  );
}
