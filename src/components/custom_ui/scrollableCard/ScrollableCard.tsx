"use client";

import React, { useRef } from "react";

import { cn } from "@/lib";
import { useScrollCard } from "@/hooks";
import { NavigateBefore, NavigateNext } from "styled-icons/material";

export function ScrollableCards({ children, parentClassName, className, innerClass }: { children: React.ReactNode, parentClassName?:string, className?:string; innerClass?:string; }) {
  const scroll = useRef<HTMLDivElement>(null);
  const { next, previous, isPrevious, isNext } = useScrollCard(scroll);
  return (
    <div className={cn("relative w-full overflow-x-hidden", parentClassName)}>
      <button
        type="button"
        className={cn(
          "hidden",
          isPrevious &&
            "absolute left-[-1px] top-[45%] z-[20] border  h-8 w-8 text-center  cursor-pointer select-none rounded-full bg-white p-1  transition-all duration-700 ease-in flex items-center justify-center"
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
            "absolute right-[-1px] top-[45%] z-[20] border flex items-center justify-center h-8 w-8 text-center cursor-pointer select-none rounded-full bg-white p-1  transition-all duration-700 ease-in "
        )}
        onClick={next}
      >
        <NavigateNext size={22} className="mx-auto text-center" />
      </button>
      <div
        ref={scroll}
        className={cn("no-scrollbar flex  w-[105%] gap-4 overflow-x-auto pl-[0em] pr-[4em] sm:pl-[1em]", className)}
      >
        <div className={cn("flex min-w-max  gap-2 sm:gap-4 ", innerClass)}>{children}</div>
      </div>
    </div>
  );
}
