"use client";

import { cn } from "@/lib";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button, MobileBottomNav, NavLinks } from ".";
import { HeaderWidget } from "./eventHome";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { EventFeedBack } from "./modals/EventFeedback";

import {
  CustomerCareIcon,
  EmailIcon,
  LogOutIcon,
  SubscriptionFrame,
  WhatsappIcon,
} from "@/constants";
import { CircleUser } from "styled-icons/fa-solid";
import { Topbar } from ".";
import { useValidateUser } from "@/hooks";

export function SideBarLayout({
  children,
  className,
  parentClassName,
  isHomePage,
  hasTopBar,
  eventId,
  eventName,
}: {
  children: React.ReactNode;
  className?: string;
  isHomePage?: boolean;
  hasTopBar?: boolean;
  parentClassName?: string;
  eventId?: string;
  eventName?: string;
}) {
  const [isNav, setNav] = useState(false);
  const param = useSearchParams();
  const [isOpen, setOpen] = useState(false);

  const [queryParam, setQueryParam] = useState<string | null>(null);
  const query = param.get("organization");

  function onOpen() {
    setOpen(true);
  }

  function onShot() {
    setOpen(false);
  }

  // validate user
  useValidateUser();

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
        className={cn(
          `w-full lg:w-[calc(100%-250px)] min-[1024px]:float-right right-0 z-50 fixed bg-white  border-gray-200 px-3 py-3 sm:py-4 sm:px-6 flex justify-between items-center `,
          parentClassName
        )}
      >
        {hasTopBar && <Topbar eventId={eventId} />}
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
      <SideNavs
        isNav={isNav}
        close={onClose}
        onClose={onShot}
        onOpen={onOpen}
        query={queryParam}
        eventId={eventId}
      />
      {isOpen && <EventFeedBack close={onShot} />}
      <MobileBottomNav eventId={eventId} toggleSideNav={onClose} />
    </>
  );
}

function SideNavs({
  close,
  isNav,
  query,
  onClose,
  eventId,
  onOpen,
}: {
  close: () => void;
  onClose: () => void;
  isNav: boolean;
  eventId?: string;
  query: string | null;
  onOpen: () => void;
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
      className={`fixed z-[9999999] inset-y-0 left-0 h-full modal swipeInLeft ${
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
        className=" py-3   sm:py-4 flex flex-col relative  items-center h-full bg-white w-[200px] sm:w-[250px] cursor-pointer shadow-md"
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
          <NavLinks
            onOpen={onOpen}
            eventId={eventId}
            query={query}
            onClose={onClose}
            id={organizationId}
          />
        </div>
        <div className="w-full text-[10px] sm:text-xs px-4 flex flex-col  items-start justify-start bottom-5 inset-x-0 absolute  gap-y-2">
          <div className="my-1 w-full flex items-center gap-x-2 p-3 rounded-md bg-zikoro/10">
            <Image
              src="/svg/sub.svg"
              width={200}
              height={200}
              alt="sub"
              className="w-16 h-20"
            />
            <div className="flex flex-col items-start justify-start gap-y-1">
              <p>Upgrade your plans for more features</p>
              <Button className="flex px-0 w-fit h-fit text-zikoro items-center gap-x-2">
                <p>Upgrade</p>
                <Image
                  src="/images/parklight.png"
                  width={200}
                  height={200}
                  alt="sub"
                  className="w-4 h-4"
                />
              </Button>
            </div>
          </div>
          <div className="w-full flex items-center gap-x-2">
              <p className="text-mobile sm:text-sm">Powered By</p>
              <Image
              src="/images/zikoro.png"
              alt="logo"
              width={200}
              height={100}
              className="w-24 h-8"
              />
            </div>
          <div className="w-full flex items-center justify-between">
            
            <Button className="px-1 h-fit gap-x-2">
              <CustomerCareIcon />
              <span className="text-mobile sm:text-desktop">Support</span>
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
          <div className="text-mobile sm:text-desktop flex items-center gap-x-2">
            <CircleUser className="text-zikoro" size={22} />
            <p className="text-mobile sm:text-desktop">Idris Rasheed</p>
          </div>
          <Link
            href="/api/auth/logout"
            className="flex items-center h-fit gap-x-2"
          >
            <LogOutIcon />
            <span className="text-[#EC2D30] text-mobile sm:text-desktop">
              Log Out
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
