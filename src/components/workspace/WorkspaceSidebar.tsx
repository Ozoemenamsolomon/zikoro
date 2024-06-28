"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCookie, useCheckTeamMember } from "@/hooks";
import { cn } from "@/lib";
import { ArrowExportLtr } from "@styled-icons/fluentui-system-filled/ArrowExportLtr";
import { ArrowExportRtl } from "@styled-icons/fluentui-system-filled/ArrowExportRtl";
import useUserStore from "@/store/globalUserStore";

const WorkspaceSidebar = () => {
  const pathname = usePathname();
  const [isShowNav, setShowNav] = useState(false);
  const [isScrolling, setScrolling] = useState(false);
  const [left, setLeft] = useState(false);
  const { user } = useUserStore();

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

    document.addEventListener("click", () => {
      const sideBar = document.getElementById("sidebar");
      if (sideBar) {
        const sideBarStyle = window.getComputedStyle(sideBar);
        // console.log(sideBarStyle.display);
        if (sideBarStyle.display === "none") {
          setLeft(false);
        } else {
          setLeft(true);
        }
      }
    });
  }, []);

  const links = [
    {
      name: "General",
      href: `/general`,
    },
    {
      name: "Domain",
      href: `/domain`,
    },
    {
      name: "Team",
      href: `/team`,
    },
    {
      name: "Link Sharing",
      href: `/link-sharing`,
    },
  ];

  return (
    <>
      <nav
        className={cn(
          "w-fit border-b-0 left-0 sm:left-[60px] bg-white lg:border-b-0 lg:w-[180px] lg:pb-10 border-r-0 lg:border-r z-[10] fixed  h-fit lg:h-[calc(100%-68px)] top-[60px] sm:top-[68px] overflow-y-auto top-nav-scroll",
          isShowNav &&
            "w-[180px] border-b-0 h-[calc(100%-68px)] pb-10 border-r",
          left && "left-[60px]"
        )}
      >
        <div
          className={cn(
            "bg-white w-full  lg:px-4 lg:pt-5   h-full ",
            isShowNav && "px-4 pt-5 "
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
                " px-4 pt-[0.6rem] pb-[0.5rem]   lg:hidden",
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
              "hidden lg:flex flex-col pb-20 mt-4 lg:mt-0 items-start gap-y-6 justify-start text-gray-700",
              isShowNav && "flex"
            )}
          >
            {links.map(({ name, href }, index) => {
              return (
                <li
                  key={index}
                  className={`w-full p-2 text-sm ${
                    pathname.includes(href)
                      ? "bg-gradient-to-tr from-custom-bg-gradient-start to-custom-bg-gradient-end   rounded-lg font-medium"
                      : ""
                  }`}
                >
                  <Link href={`/workspace${href}`}>{name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
};

export { WorkspaceSidebar };
