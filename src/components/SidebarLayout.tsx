"use client";

import { cn } from "@/lib";
import { useState } from "react";
import Image from "next/image";
import { NavLinks } from ".";

export function SideBarLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isNav, setNav] = useState(false);

  function onClose() {
    setNav((nav) => !nav);
  }

  return (
    <>
      <div
        className={`w-full lg:w-[calc(100%-250px)] min-[1024px]:float-right right-0 z-50 fixed bg-white  border-gray-200 px-3 py-3 sm:py-4 sm:px-6 flex justify-between items-center `}
      >
        <div className="justify-between  w-full flex items-center"></div>
      </div>

      <div
        className={cn(
          "lg:w-[calc(100%-250px)]  min-[1024px]:float-right px-2 sm:px-6 pt-16 pb-12 sm:pt-24 ",
          className
        )}
      >
        {children}
      </div>
      <SideNavs isNav={isNav} close={onClose} />
    </>
  );
}

function SideNavs({ close, isNav }: { close: () => void; isNav: boolean }) {
  

  return (
    <div
      aria-roledescription="container"
      role="button"
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
      className={`fixed z-[70] inset-y-0 left-0 h-full modal swipeInLeft ${
        isNav
          ? "w-full bg-white/50  min-[1024px]:w-[250px]"
          : "max-[1024px]:hidden w-[250px] "
      }`}
    >
      <div
        aria-roledescription="container"
        role="button"
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" py-3   sm:py-4 flex flex-col relative overflow-y-auto items-center h-full w-[250px] cursor-pointer shadow-md"
      >
        <div className="flex  flex-col gap-y-10 items-center w-full justify-center">
          <Image
            src={"/images/zikoro.png"}
            alt="logo"
            width={300}
            height={200}
            className="w-[150px] h-[50px]"
          />
          {/**nav links */}
          <NavLinks />
        </div>
      </div>
    </div>
  );
}
