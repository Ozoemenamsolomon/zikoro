"use client";

import { cn } from "@/lib";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Button, MobileBottomNav, NavLinks } from ".";
import Link from "next/link";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { EventFeedBack } from "./modals/EventFeedback";
import { VipCrown2 } from "styled-icons/remix-fill";
import MainTopBar from "@/components/MainTopBar";
import { PlusCircle } from "styled-icons/bootstrap";
import {
  CustomerServiceIcon,
  EmailIcon,
  FeedBackIcon,
  LogOutIcon,
  ReferralIcon,
  WhatsappIcon,
} from "@/constants";
import {
  getCookie,
  useGetEvents,
  useGetUserTeamOrganizations,
  useLogOut,
  useValidateUser,
} from "@/hooks";
import { sendMail, whatsapp } from "@/utils";
import { TUser } from "@/types";
import useUserStore from "@/store/globalUserStore";

export function SideBarLayout({
  eventId,
  children,
}: {
  eventId: string;
  children: React.ReactNode;
}) {
  const [isNav, setNav] = useState(false);
  const param = useSearchParams();

  const [isOpen, setOpen] = useState(false);
  const query = param.get("organization");
  const { events } = useGetEvents();
  const { user, setUser } = useUserStore();
  const router = useRouter();

  console.log(user);

  // get events
  const isHaveEvent = useMemo(() => {
    return (
      Array.isArray(events) &&
      events?.filter(({ createdBy }) => Number(createdBy) === Number(user?.id))
        ?.length > 0
    );
  }, [events]);

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

  const {
    userOrganizations,
    isLoading: organizationIsLoading,
    getUserOrganizations,
  } = useGetUserTeamOrganizations({ userEmail: user?.userEmail });

  useEffect(() => {
    return () => {
      if (organizationIsLoading) return;

      if (!userOrganizations) return router.push("/home");
    };
  }, [organizationIsLoading]);

  return (
    <>
      <div
        className={cn(
          "w-full sm:w-[calc(100%-60px)]  bg-white float-right right-0 z-[55] fixed flex justify-between items-center ",
          isNav && "w-[calc(100%-60px)]"
        )}
      >
        <MainTopBar eventId={eventId} userOrganizations={userOrganizations} />
      </div>

      <SideNavs
        isNav={isNav}
        close={onClose}
        onClose={onShot}
        onOpen={onOpen}
        query={query}
        isHaveEvent={isHaveEvent}
      />
      <div className="w-full sm:w-[calc(100%-60px)] float-right mt-24">
        {children}
      </div>
      {isOpen && <EventFeedBack close={onShot} />}
      <MobileBottomNav toggleSideNav={onClose} isHaveEvent={isHaveEvent} />
    </>
  );
}

function SideNavs({
  close,
  isNav,
  query,
  onClose,
  onOpen,
  isHaveEvent,
}: {
  close: () => void;
  onClose: () => void;
  isNav: boolean;
  query: string | null;
  onOpen: () => void;
  isHaveEvent?: boolean;
}) {
  const { organizationId }: { organizationId: string } = useParams();
  const router = useRouter();
  const { logOut } = useLogOut();
  const { user, setUser } = useUserStore();

  // max-[1024px]:hidden
  return (
    <>
      <div
        aria-roledescription="container"
        role="button"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        id="sidebar"
        className={`fixed  transition-all duration-300 transform ease-in-out group  inset-y-0 left-0 h-full ${
          isNav
            ? " bg-white/50 block z-[60] group-hover:w-[180px] group-hover:sm:w-[180px] w-[60px]  "
            : " z-[60] max-[642px]:hidden group-hover:w-[180px] group-hover:sm:w-[180px] w-[60px]"
        }`}
      >
        <div
          aria-roledescription="container"
          role="button"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className=" py-3 sm:py-4 group-hover:w-[180px] group-hover:sm:w-[180px] w-[60px] flex flex-col items-center justify-between relative h-full bg-white  cursor-pointer border-r"
        >
          <div className="flex  flex-col gap-y-10 items-start w-full">
            <Image
              src={"/images/zikoro_logo.png"}
              alt="logo"
              width={300}
              height={200}
              className="w-[40px] h-[40px] mx-4"
            />
            {/**nav links */}
            <NavLinks
              isHaveEvent={isHaveEvent}
              query={query}
              id={organizationId}
            />
          </div>
          <div className="flex items-start text-[#717171] justify-start w-full flex-col gap-4 border-t p-4 border-basebody">
            <div className="w-full flex items-center gap-x-2 ">
              <Link
                href={`create`}
                className="text-mobile sm:text-sm text-basePrimary font-medium hover:underline "
              >
                <p>
                  <PlusCircle size={18} />{" "}
                </p>
                <p>Event</p>
              </Link>
            </div>
            {/*
          organization?.plan && (
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
          )
        */}
            <Link href={"/profile"}>
              <div className="flex items-center gap-2">
                <Image
                  src={"/images/profile%201.png"}
                  alt={"user avatar"}
                  width={30}
                  height={30}
                  className="w-[20px] h-[20px] rounded-full"
                />
                <p className="font-medium group-hover:block hidden capitalize text-mobile sm:text-sm">
                  {user?.firstName ?? "User"}
                </p>
              </div>
            </Link>
            <button onClick={onOpen} className="flex gap-2 ">
              <FeedBackIcon />
              <p className="font-medium group-hover:block hidden">
                {" "}
                Give feedback
              </p>
            </button>
            <Link href={"/referrals"}>
              <div className="flex items-center gap-2">
                <ReferralIcon />
                <p className="font-medium group-hover:block hidden">
                  Refer a friend
                </p>
              </div>
            </Link>
            <div className="w-full flex items-center justify-between">
              <Button className="px-1 h-fit gap-x-2">
                <CustomerServiceIcon />
                <span className="text-mobile group-hover:block hidden font-medium sm:text-sm">
                  Support
                </span>
              </Button>
              <div className="items-center group-hover:flex hidden gap-x-2">
                <Button
                  onClick={() => whatsapp("+2347041497076")}
                  className="px-0 h-fit"
                >
                  <WhatsappIcon />
                </Button>
                <Button
                  onClick={() => sendMail("admin@zikoro.com")}
                  className="px-0 h-fit"
                >
                  <EmailIcon />
                </Button>
              </div>
            </div>
            <button
              onClick={logOut}
              className="flex items-center h-fit gap-x-2"
            >
              <LogOutIcon />
              <span className="text-[#EC2D30] group-hover:block hidden font-medium text-mobile sm:text-sm">
                Log Out
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
