"use client";

import { useState } from "react";
import Image from "next/image";
import { adminLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { PersonFeedback } from "styled-icons/fluentui-system-filled";
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
      className={`fixed z-[49] inset-y-0 left-0 h-full ${
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
            {adminLinks.map(({ href, name, image }) => {
              const currentHref = href.includes("?")
                ? href?.split("?")[0]
                : href;
              return (
                <li key={name} className="w-full">
                  <Link
                    href={`/admin/${href}`}
                    className={cn(
                      "p-3 pr-4 pl-4 flex  items-center gap-x-2  w-full",
                      pathname.includes(currentHref) &&
                        "text-basePrimary pl-2 pr-4  bg-[#001fcc]/10 border-l-4 border-basePrimary bg-opacity-10  "
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
              );
            })}
          </ul>
        </div>

        <div className="w-full absolute py-4 bg-[#001fcc]/10 bottom-0 inset-x-0">
          <div className="w-full bg-white px-3 gap-y-1 flex flex-col items-start justify-start py-8">
            <p className="w-full text-start">Admin Feedback</p>
            <p className="text-tiny text-xs w-full">
              Share this feedback link with users to gather their suggestions
              and report issues. Help us improve the platform based on user
              feedback.
            </p>
            <Link
              href="/feedback"
              className="w-fit px-4 h-10 rounded-md bg-basePrimary text-white flex gap-x-2 items-center justify-center font-medium"
            >
              <PersonFeedback size={20} />
              <p>Feedback</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
