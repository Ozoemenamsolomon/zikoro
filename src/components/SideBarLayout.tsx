"use client";

import { cn } from "@/lib";
import { useState } from "react";
import Image from "next/image";
import { Button, MobileBottomNav, NavLinks } from ".";
import Link from "next/link";
import { useSearchParams, useParams } from "next/navigation";
import { EventFeedBack } from "./modals/EventFeedback";
import { VipCrown2 } from "styled-icons/remix-fill";
import { PersonFeedback } from "styled-icons/fluentui-system-filled";

import {
  CustomerCareIcon,
  EmailIcon,
  LogOutIcon,
  WhatsappIcon,
} from "@/constants";
import { getCookie, useValidateUser } from "@/hooks";

export function SideBarLayout() {
  const [isNav, setNav] = useState(false);
  const param = useSearchParams();
  const [isOpen, setOpen] = useState(false);
  const query = param.get("organization");

  function onOpen() {
    setOpen(true);
  }

  function onShot() {
    setOpen(false);
  }

  // validate user
  useValidateUser();

  function onClose() {
    setNav((nav) => !nav);
  }

  return (
    <>
      <SideNavs
        isNav={isNav}
        close={onClose}
        onClose={onShot}
        onOpen={onOpen}
        query={query}
      />
      {isOpen && <EventFeedBack close={onShot} />}
      <MobileBottomNav toggleSideNav={onClose} />
    </>
  );
}

function SideNavs({
  close,
  isNav,
  query,
  onClose,
  onOpen,
}: {
  close: () => void;
  onClose: () => void;
  isNav: boolean;
  query: string | null;
  onOpen: () => void;
}) {
  const { organizationId } = useParams();
  const organization = getCookie("currentOrganization");
  const user = getCookie("user");

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
          <NavLinks query={query} id={organizationId} />
        </div>
        <div className="flex items-start justify-start w-full flex-col gap-4 border-t p-4 border-basebody">
          <div className="w-full flex items-center gap-x-2 ">
            <Link
              href="https://www.zikoro.com"
              className="text-mobile sm:text-sm text-basePrimary font-medium hover:underline "
            >
              Try Zikoro!
            </Link>
          </div>
          {organization?.plan && (
            <div className="my-1 w-full flex text-mobile sm:text-sm items-center gap-x-2 p-3 rounded-md bg-basePrimary/10">
              <div className="w-20 h-fit flex rounded-md flex-col items-center justify-center p-2 bg-[#eef0ff]">
                <VipCrown2 size={12} className="text-basePrimary" />
                <p className="text-basePrimary font-medium text-[8px] px-[2px] py-[1px] bg-basePrimary/10">
                  {organization?.plan}
                </p>
                <p className="text-basePrimary font-medium text-[8px]">Plan</p>
              </div>

              <div className="flex flex-col items-start text-tiny sm:text-xs justify-start gap-y-1">
                <p>Upgrade your plans for more features</p>
                <Button className="flex px-0 w-fit h-fit text-basePrimary items-center gap-x-2">
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
          )}
          <Link href={"/profile"}>
            <div className="flex items-center gap-2">
              <Image
                src={"/images/profile%201.png"}
                alt={"user avatar"}
                width={30}
                height={30}
                className="w-[30px] h-[30px] rounded-full"
              />
              <p className="text-black capitalize text-mobile sm:text-sm">
                {user?.firstName ?? "User"}
              </p>
            </div>
          </Link>
          <button onClick={onOpen} className="flex gap-2 text-black">
            <PersonFeedback className="w-6 h-6" />
            Give feedback
          </button>
          <Link href={"/referrals"}>
            <div className="flex items-center gap-2 text-basePrimary">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 16 16"
                height="1.5em"
                width="1.5em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M2 6v8.5a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V6h1v8.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 011 14.5V6h1zm8-5a1.5 1.5 0 00-1.5 1.5c0 .098.033.16.12.227.103.081.272.15.49.2A3.44 3.44 0 009.96 3h.015L10 2.999l.025.002h.014A2.569 2.569 0 0010.293 3c.17-.006.387-.026.598-.073.217-.048.386-.118.49-.199.086-.066.119-.13.119-.227A1.5 1.5 0 0010 1zm0 3h-.006a3.535 3.535 0 01-.326 0 4.435 4.435 0 01-.777-.097c-.283-.063-.614-.175-.885-.385A1.255 1.255 0 017.5 2.5a2.5 2.5 0 015 0c0 .454-.217.793-.506 1.017-.27.21-.602.322-.885.385a4.434 4.434 0 01-1.104.099H10z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6 1a1.5 1.5 0 00-1.5 1.5c0 .098.033.16.12.227.103.081.272.15.49.2A3.44 3.44 0 005.96 3h.015L6 2.999l.025.002h.014l.053.001a3.869 3.869 0 00.799-.076c.217-.048.386-.118.49-.199.086-.066.119-.13.119-.227A1.5 1.5 0 006 1zm0 3h-.006a3.535 3.535 0 01-.326 0 4.435 4.435 0 01-.777-.097c-.283-.063-.614-.175-.885-.385A1.255 1.255 0 013.5 2.5a2.5 2.5 0 015 0c0 .454-.217.793-.506 1.017-.27.21-.602.322-.885.385a4.435 4.435 0 01-1.103.099H6zm1.5 12V6h1v10h-1z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M15 4H1v1h14V4zM1 3a1 1 0 00-1 1v1a1 1 0 001 1h14a1 1 0 001-1V4a1 1 0 00-1-1H1z"
                  clipRule="evenodd"
                />
              </svg>
              <p>Refer a friend</p>
            </div>
          </Link>
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
          <button onClick={logOut} className="flex items-center h-fit gap-x-2">
            <LogOutIcon />
            <span className="text-[#EC2D30] text-mobile sm:text-desktop">
              Log Out
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
