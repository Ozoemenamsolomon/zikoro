"use client";

import { cn } from "@/lib";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button, NavLinks } from ".";
import { HeaderWidget } from "./home";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useSearchParams, useParams } from "next/navigation";
import {
  CustomerCareIcon,
  EmailIcon,
  LogOutIcon,
  SubscriptionFrame,
  WhatsappIcon,
} from "@/constants";
import { CircleUser } from "styled-icons/fa-solid";

export function SideBarLayout({
  children,
  className,
  parentClassName,
  isHomePage,
}: {
  children: React.ReactNode;
  className?: string;
  isHomePage?: boolean;
  parentClassName?: string;
}) {
  const { user, error } = useUser();

  const [isNav, setNav] = useState(false);
  const param = useSearchParams();

  const [queryParam, setQueryParam] = useState<string | null>(null);
  const query = param.get("organization");

  useEffect(() => {
    if (param) {
      setQueryParam(query);
    }
  }, []);

  function onClose() {
    setNav((nav) => !nav);
  }

  return (
    <>
      <div
        className={cn(`w-full lg:w-[calc(100%-250px)] min-[1024px]:float-right right-0 z-50 fixed bg-white  border-gray-200 px-3 py-3 sm:py-4 sm:px-6 flex justify-between items-center `,  parentClassName)}
      >
        <div className="justify-between  w-full flex items-center"></div>
      </div>

      <div
        className={cn(
          "lg:w-[calc(100%-250px)]  min-[1024px]:float-right px-2 sm:px-6 pt-16 pb-12 sm:pt-24 ",
          className
        )}
      >
        {isHomePage && <HeaderWidget currentQuery={query} />}
        {children}
      </div>
      <SideNavs isNav={isNav} close={onClose} query={queryParam} />
    </>
  );
}

function SideNavs({
  close,
  isNav,
  query,
}: {
  close: () => void;
  isNav: boolean;
  query: string | null;
}) {
  const { organizationId } = useParams();

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
        className=" py-3   sm:py-4 flex flex-col relative  items-center h-full w-[250px] cursor-pointer shadow-md"
      >
        <div className="flex  flex-col gap-y-10 items-center w-full">
          <Image
            src={"/images/zikoro.png"}
            alt="logo"
            width={300}
            height={200}
            className="w-[150px] h-[40px]"
          />
          {/**nav links */}
          <NavLinks query={query} id={organizationId} />
        </div>
        <div className="w-full px-4 flex flex-col  items-start justify-start bottom-5 inset-x-0 absolute  gap-y-2">
          <div className="w-full">
            <SubscriptionFrame />
          </div>
          <div className="w-full flex items-center justify-between">
            <Button className="px-1 h-fit gap-x-2">
              <CustomerCareIcon />
              <span>Support</span>
            </Button>
            <div className="flex items-center gap-x-2">
              <Button className="px-0 h-fit">
                <WhatsappIcon />
              </Button>
              <Button className="px-0 h-fit">
                <EmailIcon />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <CircleUser className="text-zikoro" size={22} />
            <p>Idris Rasheed</p>
          </div>
          <Link
            href="/api/auth/logout"
            className="flex items-center h-fit gap-x-2"
          >
            <LogOutIcon />
            <span className="text-[#EC2D30]">Log Out</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
