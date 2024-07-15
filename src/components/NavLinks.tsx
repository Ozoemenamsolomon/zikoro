"use client";
import React from "react";
import Link from "next/link";
import { links } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { Button } from "@/components";
import { useMemo } from "react";
import { HomeIcon } from "@/constants";

export const NavLinks = ({
  query,
  id,
  isHaveEvent,
}: {
  id: string;
  query: string | null;
  isHaveEvent?: boolean;
}) => {
  const pathname = usePathname();

  const navs = useMemo(() => {
    return isHaveEvent
      ? links
      : [
          {
            name: "Home",
            icon: HomeIcon,
            href: "/home",
          },
        ];
  }, [isHaveEvent]);

  return (
    <ul className={cn("flex text-mobile sm:text-sm flex-col px-3 gap-y-1 items-start  pb-32 overflow-hidden  no-scrollbar overflow-y-auto  justify-start w-full h-[30vh] sm:h-[45vh]", !isHaveEvent && "h-[20vh] sm:h-[30vh]")}>
      {navs.map(({ href, name, icon: Icon }, idx) => {
        if (idx === links.length - 1) {
          return (
            <li
              key={name}
              className={cn("h-fit w-full", query === null && "hidden")}
            >
              <Button
                className={cn(
                  "p-3 px-0 h-fit flex    items-center font-medium rounded-lg justify-start gap-x-2 text-[#717171] group-hover:w-full w-fit",
                  pathname.includes(href) &&
                    "bg-basePrimary/10 text-[#1F1F1F]  "
                )}
              >
                {Icon && (
                  <Icon color={href === pathname ? "#1F1F1F" : "#717171"} />
                )}
                <span className="group-hover:block hidden">{name}</span>
              </Button>

              <ul className="w-full group-hover:flex hidden  flex-col gap-y-1 pl-12 text-xs sm:text-sm items-start justify-start">
                <li className="w-full">
                  <Link
                    prefetch={false}
                    href={`${href}/${id}?organization=${query}`}
                  >
                    {query}
                  </Link>
                </li>
              </ul>
            </li>
          );
        }

        return (
          <li key={name} className="w-full">
            <Link
              prefetch={false}
              href={
                href === "/live-events"
                  ? `${href}/organization/${id}?organization=${query}`
                  : href
              }
              target={href === "/live-events" ? "_blank" : ""}
              className={cn(
                "p-3  flex  items-center justify-start font-medium rounded-lg  gap-x-2 text-[#717171] group-hover:w-full w-fit",
                href === pathname && " bg-basePrimary/10 text-[#1F1F1F] ",
                query === null && href === "/live-events" && "hidden"
              )}
            >
              {Icon && (
                <Icon color={href === pathname ? "#1F1F1F" : "#717171"} />
              )}
              <span className="group-hover:block hidden">{name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
