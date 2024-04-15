"use client";

import { useState } from "react";
import Image from "next/image";
import { adminLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
export function AdminSideBar() {
  const [isNav, setNav] = useState(false);

  function onClose() {
    setNav((nav) => !nav);
  }
  return (
    <>
      <SideNav close={onClose} isNav={isNav} />
    </>
  );
}

function SideNav({ close, isNav }: { isNav: boolean; close: () => void }) {
  const pathname = usePathname();
  return (
    <div
      aria-roledescription="container"
      role="button"
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
      className={`fixed z-[99] inset-y-0 left-0 h-full ${
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
        className=" py-3   sm:py-4 flex flex-col items-center justify-between relative h-full bg-white w-[200px] sm:w-[250px] cursor-pointer border-r"
      >
        <div className="flex  flex-col gap-y-10 items-start w-full">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={300}
            height={200}
            className="w-[150px] h-[40px] mx-4"
          />
          {/**nav links */}
          <ul className="flex flex-col gap-y-1 items-start  pb-24  no-scrollbar overflow-y-auto  justify-start w-full">
            {adminLinks.map(({ href, name, image }) => (
              <li key={name} className="w-full">
                <Link
                  href={`/admin/${href}`}
                 
                  className={cn(
                    "p-3 pr-4 pl-4 flex  items-center gap-x-2  w-full",
                    pathname.includes(href) &&
                      "text-basePrimary pl-2 pr-4  bg-basePrimary border-l-4 border-basePrimary bg-opacity-10  "
                  )}
                >
                  <Image
                    alt={name}
                    src={image}
                    width={30}
                    height={30}
                    className="w-6 h-6"
                  />
                  <span>{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
