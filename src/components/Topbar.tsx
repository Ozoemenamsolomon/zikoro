"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCookie, useCheckTeamMember } from "@/hooks";
import { AccessVerification } from "./composables";
import { cn } from "@/lib";
import { Button } from ".";
import { ArrowExportLtr } from "@styled-icons/fluentui-system-filled/ArrowExportLtr";
import { ArrowExportRtl } from "@styled-icons/fluentui-system-filled/ArrowExportRtl";

const Topbar = ({ eventId }: { eventId?: string }) => {
  const pathname = usePathname();
  const [isShowNav, setShowNav] = useState(false);
  const [isScrolling, setScrolling] = useState(false);
  const user = getCookie("user");
  const { isIdPresent, eventLoading } = useCheckTeamMember({ eventId });

  useEffect(() => {
    document.addEventListener("scroll", () => {
      if (window.scrollY === 0) {
        setScrolling(false);
      } else if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    });
  }, []);

  const links = [
    {
      name: "Reception",
      href: `${eventId}/home`,
    },
    {
      name: "Contents",
      href: `${eventId}/content/info`,
    },
    {
      name: "Marketing",
      href: `${eventId}/marketing`,
    },
    {
      name: "People",
      href: `${eventId}/people/all`,
    },
    {
      name: "Agenda",
      href: `${eventId}/agenda`,
    },
    {
      name: "Partners",
      href: `${eventId}/partners?p=sponsors`,
    },
    {
      name: "Market Place",
      href: `${eventId}/market-place/jobs`,
    },

    {
      name: "Interactions",
      href: `${eventId}/interaction/stamp-card`,
    },
    {
      name: "Analytics",
      href: `${eventId}/analytics`,
    },
    {
      name: "Settings",
      href: `${eventId}/settings`,
    },
  ];

  const hideFromAttendee = ["Contents", "Analytics", "Settings", "Marketing"];
  const set = new Set(hideFromAttendee);

  const reformedLink = useMemo(() => {
    return links.filter((link) => {
      if (!user || !user?.userEmail || !isIdPresent) {
        return !set.has(String(link?.name));
      } else {
        return links;
      }
    });
  }, [user, isIdPresent]);

  return (
    <>
      <nav
        className={cn(
          "w-fit border-b-0 bg-white lg:border-b-0 lg:w-[180px] lg:pb-10 border-r-0 lg:border-r z-[55] fixed left-[60px] h-fit lg:h-[calc(100%-68px)] top-[60px] sm:top-[68px] overflow-y-auto top-nav-scroll",
          isShowNav && "w-[180px] border-b-0 h-[calc(100%-68px)] pb-10 border-r"
        )}
      >
        <div
          className={cn(
            "bg-white w-full  lg:px-4 lg:pt-5   h-full ",
            isShowNav && "px-4 pt-5"
          )}
        >
          <div
            className={cn(
              "w-full flex items-start justify-start",
              isShowNav && "items-end justify-end"
            )}
          >
            <button
              className={cn(
                " px-4 pt-[0.9rem] pb-[1rem]   lg:hidden",
                isShowNav && " pt-0 pb-0",
                isScrolling && "hidden"
              )}
              onClick={() => setShowNav((prev) => !prev)}
            >
              {isShowNav ? (
                <ArrowExportRtl size={22} />
              ) : (
                <ArrowExportLtr size={22} />
              )}
            </button>
          </div>
          <ul
            className={cn(
              "hidden lg:flex flex-col mt-4 lg:mt-0 items-start gap-y-6 justify-start text-gray-700",
              isShowNav && "flex"
            )}
          >
            {reformedLink.map(({ name, href }, index) => {
              //  console.log(href.split("/")[1].split("?"))
              const path = href.includes("?")
                ? href.split("/")[1].split("?")[0]
                : href.split("/")[1];
              return (
                <li
                  key={index}
                  className={`w-full p-2 text-sm ${
                    pathname.split("/")[3].includes(path)
                      ? "bg-basePrimary/20  rounded-lg font-medium"
                      : ""
                  }`}
                >
                  <Link href={`/event/${href}`}>{name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/**
           <AccessVerification
        eventLoading={eventLoading}
        isEventIdPresent={isIdPresent}
        id={eventId}
      />
       */}
    </>
  );
};

export { Topbar };
